import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-denegada',
  templateUrl: './orden-compra-denegada.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, CustomInputModule],
  providers: [CustomToastService],
})
export default class OrdenCompraDenegadaComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  private customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  ordenCompraId: number = 0;
  ordenCompraAuthId: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: [],
    ordenCompraId: [],
    fechaAutorizacion: [],
    statusOrdenCompra: [],
    observaciones: [''],
    applicationUserAuthId: [],
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.ordenCompraAuthId = this.config.data.ordenCompraAuthId;
    this.form = this.formBuilder.group({
      id: [this.ordenCompraAuthId],
      ordenCompraId: [this.ordenCompraId],
      fechaAutorizacion: [''],
      statusOrdenCompra: [1],
      observaciones: ['', Validators.required],
      applicationUserAuthId: [
        this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
      ],
    });
  }

  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.customSwalService.onLoading();

    this.subRef$ = this.dataService
      .put(
        `OrdenCompraAuth/NoAutorizada/${this.ordenCompraAuthId}/${this.authService.userTokenDto.infoEmployeeDto.employeeId}`,
        this.form.value
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customSwalService.onClose();
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
