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
import { ERouteRecurrence } from 'src/app/enums/recurrencia-recorrido.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-recorrido',
  templateUrl: './addoreedit-recorrido.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class RecorridoAddOrEditComponent implements OnInit, OnDestroy {
  public selectItemService = inject(SelectItemService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  subRef$: Subscription;
  form: FormGroup;
  id: number = 0;
  cb_machinery: ISelectItemDto[] = [];
  idMachinery: number = null;
  cb_RouteRecurrence: ISelectItemDto[] =
    onGetSelectItemFromEnum(ERouteRecurrence);

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp: any) => {
        this.cb_machinery = resp;
      });
  }

  public saveMachineryId(e): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.onLoadSelectItem();
    this.onLoadForm();
  }

  onLoadData() {
    this.subRef$ = this.dataService.get('Routes/' + this.id).subscribe({
      next: (resp: any) => {
        this.form.patchValue(resp.body);
      },
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      position: ['', Validators.required],
      routeRecurrence: [0, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.customSwalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`Routes`, this.form.value)
        .subscribe({
          next: () => {
            this.customSwalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customSwalService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`Routes/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customSwalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customSwalService.onClose();
          },
        });
    }
  }
  createModel(form: any) {
    return {
      machineryId: form.machineryId.value,
      position: form.position,
      routeRecurrence: form.routeRecurrence,
    };
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
