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
import { IInventarioLlaveAddOrEditDto } from 'src/app/interfaces/IInventarioLlaveAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-inventario-llave',
  templateUrl: './form-inventario-llave.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
  providers: [ToastService],
})
export default class FormInventarioLlaveComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public authService = inject(AuthService);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;
  cb_equipoClasificacion: ISelectItemDto[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getcustomerId(), [Validators.required]],
    descripcion: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    numeroLlave: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
    equipoClasificacionId: ['', [Validators.required]],
    applicationUserId: [
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
      [Validators.required],
    ],
  });

  ngOnInit() {
    this.onLoadEquipoClasificacion();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get<IInventarioLlaveAddOrEditDto>(`InventarioLlave/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
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
    this.swalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`InventarioLlave`, this.form.value)
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
        .put(`InventarioLlave/${this.id}`, this.form.value)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
  onLoadEquipoClasificacion() {
    this.subRef$ = this.dataService
      .get('EquipoClasificacion/SelectItem')
      .subscribe({
        next: (resp: any) => {
          this.cb_equipoClasificacion = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
}
