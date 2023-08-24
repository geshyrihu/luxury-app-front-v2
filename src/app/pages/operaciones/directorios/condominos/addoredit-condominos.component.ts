import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EHabitant } from 'src/app/enums/habitante.enum';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-condominos',
  templateUrl: './addoredit-condominos.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [ToastService],
})
export default class AddOrEditCondominosComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  public customerIdService = inject(CustomerIdService);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;
  customerId: number = this.customerIdService.customerId;
  cb_directory_condominium: any[] = [];
  cb_enviarMails: ISelectItemDto[] = [
    {
      label: 'Sí',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];
  cb_Habitant: ISelectItemDto[] = onGetEnum(EHabitant);
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerId],
    cellPhone: ['', Validators.required],
    directoryCondominiumId: ['', Validators.required],
    directoryCondominium: ['', Validators.required],
    extencion: [''],
    fixedPhone: [''],
    habitant: ['', Validators.required],
    mail: [''],
    nameDirectoryCondominium: ['', Validators.required],
    enviarMails: [],
    user: [''],
  });

  ngOnInit(): void {
    this.customerId = this.customerIdService.customerId;
    this.selectItemService
      .onGetSelectItem(
        `DirectoryCondominium/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp) => {
        this.cb_directory_condominium = resp;
      });
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.getImem();
    }
  }

  public savePropiedadId(e): void {
    let find = this.cb_directory_condominium.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      directoryCondominiumId: find?.value,
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`ListCondomino/`, this.form.value)
        .subscribe({
          next: () => {
            this.swalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.toastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.swalService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`ListCondomino/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.swalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.toastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.swalService.onClose();
          },
        });
    }
  }
  getImem() {
    this.subRef$ = this.dataService
      .get(`ListCondomino/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);

        this.form.patchValue({
          directoryCondominium: resp.body.directoryCondominium,
        });
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
