import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RatingModule } from 'primeng/rating';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-calificacion-proveedor',
  templateUrl: './calificacion-proveedor.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, RatingModule],
  providers: [CustomToastService],
})
export default class CalificacionProveedorComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  providerId: number = 0;
  qualificationProviderId: number = 0;
  form: FormGroup = this.formBuilder.group({
    employeeId: [
      this.authService.userTokenDto.infoEmployeeDto.employeeId,
      Validators.required,
    ],
    providerId: [this.config.data.providerId, Validators.required],
    precio: [0, Validators.required],
    servicio: [0, Validators.required],
    entrega: [0, Validators.required],
  });

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(
        `QualificationProviders/${this.authService.userTokenDto.infoEmployeeDto.employeeId}/${this.providerId}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.qualificationProviderId = resp.body.id;
            this.form.patchValue(resp.body);
          }
        },
        error: (err) => {
          err.error;
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
    this.customSwalService.onLoading();

    if (this.qualificationProviderId === 0) {
      this.subRef$ = this.dataService
        .post(`QualificationProviders`, this.form.value)
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
        .put(
          `QualificationProviders/${this.qualificationProviderId}`,
          this.form.value
        )
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
