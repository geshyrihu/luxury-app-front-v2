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
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-contrato-poliza',
  templateUrl: './addoredit-contrato-poliza.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [ToastService],
})
export default class AddoreditContratoPolizaComponent
  implements OnInit, OnDestroy
{
  private serviceIdCustomer = inject(CustomerIdService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public selectItemService = inject(SelectItemService);
  public ref = inject(DynamicDialogRef);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;
  urlBaseImg = environment.base_urlImg;
  model: any;
  cb_providers: ISelectItemDto[] = [];
  file: File;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    providerId: ['', Validators.required],
    providerName: ['', Validators.required],
    customerId: [this.serviceIdCustomer.getcustomerId(), Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    document: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
    });

    flatpickrFactory();
    if (this.id !== 0) this.onLoadData();
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`ContratoPoliza/${this.id}`)
      .subscribe((resp: any) => {
        this.id = resp.body.id;
        this.form.patchValue(resp.body);
        this.form.patchValue({
          providerId: resp.body.providerId,
        });
        this.form.patchValue({
          providerName: resp.body.providerName,
        });
      });
  }
  submit() {
    let formData = this.createModel(this.form);

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`ContratoPoliza`, formData)
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
        .put(`ContratoPoliza/${this.id}`, formData)
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

  uploadFile(event) {
    this.file = event.target.files[0];
  }
  createModel(form: FormGroup): FormData {
    const formData = new FormData();
    if (this.file !== undefined) {
      formData.append('document', this.file);
    }

    formData.append('providerId', String(form.get('providerId').value));
    formData.append('customerId', String(form.get('customerId').value));
    formData.append('description', form.get('description').value);
    formData.append(
      'startDate',
      this.dateService.formDateToString(form.get('startDate').value)
    );
    formData.append(
      'endDate',
      this.dateService.formDateToString(form.get('endDate').value)
    );

    return formData;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
