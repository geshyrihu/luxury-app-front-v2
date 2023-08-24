import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/services/catalogo-gastos-fijos.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
@Component({
  selector: 'app-form-catalogo-gastos-fijos',
  templateUrl: './form-catalogo-gastos-fijos.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    ComponentsModule,
    CommonModule,
    ToastModule,
    CustomInputModule,
  ],
  providers: [MessageService, ToastService],
})
export default class FormCatalogoGastosFijosComponent
  implements OnInit, OnDestroy
{
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  public customerIdService = inject(CustomerIdService);
  submitting: boolean = false;
  subRef$: Subscription;

  @Input()
  id: number = 0;
  anio = 2021;
  cb_use_cfdi: any[] = [];
  cb_metodoDePago: any[] = [];
  cb_formaDePago: any[] = [];

  cb_providers: any[] = [];
  proveedor: SelectItem;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.customerId],
    equipoOInstalacion: ['', Validators.required],
    justificacionGasto: ['', Validators.required],
    providerName: ['', Validators.required],
    providerId: ['', Validators.required],
    usoCFDIId: ['', Validators.required],
    metodoDePagoId: [19, Validators.required],
    formaDePagoId: [1, Validators.required],
    catalogoGastosFijosPresupuesto: this.formBuilder.array([]),
    catalogoGastosFijosDetalles: this.formBuilder.array([]),
    applicationUserId: [
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
    ],
  });

  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
    this.selectItemService.onGetSelectItem('UseCFDI').subscribe((resp) => {
      this.cb_use_cfdi = resp;
    });
    this.selectItemService
      .onGetSelectItem('PaymentMethod')
      .subscribe((resp) => {
        this.cb_metodoDePago = resp;
      });
    this.selectItemService.onGetSelectItem('WayToPay').subscribe((resp) => {
      this.cb_formaDePago = resp;
    });

    this.id = this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    if (this.id !== 0) this.onLoadData();
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadData() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get<any>(`CatalogoGastosFijos/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.catalogoGastosFijosService.setCatalogoGastosFijosId(
            resp.body.id
          );

          this.form.patchValue(resp.body);
          this.form.patchValue({
            providerName: resp.body.provider,
          });
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
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
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`CatalogoGastosFijos`, this.form.value)
        .subscribe({
          next: (resp: any) => {
            this.toastService.onShowSuccess();
            this.id = resp.body.id;
            this.onLoadData();
            this.swalService.onClose();
          },
          error: (err) => {
            this.toastService.onShowError();
            console.log(err.error);
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.swalService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`CatalogoGastosFijos/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.onLoadData();
            this.swalService.onClose();
            this.toastService.onShowSuccess();
          },
          error: (err) => {
            this.toastService.onShowError();
            console.log(err.error);
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
}
