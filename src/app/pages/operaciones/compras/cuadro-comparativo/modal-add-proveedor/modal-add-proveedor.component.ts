import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-modal-add-proveedor',
  templateUrl: './modal-add-proveedor.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class ModalAddProveedorComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public toastService = inject(ToastService);
  private swalService = inject(SwalService);

  submitting: boolean = false;
  subRef$: Subscription;

  form: FormGroup;
  cb_providers: ISelectItemDto[] = [];

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadProviders();
    this.form = this.formBuilder.group({
      solicitudCompraId: [
        this.config.data.solicitudCompraId,
        Validators.required,
      ],
      providerId: ['', { validators: [Validators.required] }],
      providerName: ['', { validators: [Validators.required] }],
      fechaCotizacion: ['', { validators: [Validators.required] }],
      numeroCotizacion: [''],
    });
  }
  public saveProviderId(e): void {
    let find = this.cb_providers.find(
      (x) => x.label.toLowerCase() === e.target.value.toLowerCase()
    );

    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadProviders() {
    this.subRef$ = this.dataService
      .get(
        `CotizacionProveedor/GetProviders/${this.config.data.solicitudCompraId}`
      )
      .subscribe((resp: any) => {
        this.cb_providers = resp.body;
      });
  }

  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .post('CotizacionProveedor', this.form.value)
      .subscribe({
        next: () => {
          this.ref.close(true);
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
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
