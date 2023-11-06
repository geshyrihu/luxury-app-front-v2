import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EmailDataAddOrEditDto } from 'src/app/interfaces/email-data-add-or-edit.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-email-data',
  templateUrl: './add-or-edit-email-data.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
    NgbAlertModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditEmailDataComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);

  private customToastService = inject(CustomToastService);

  id: number = 0;
  applicationUserId: number = 0;
  testEmailMessage: string = '';
  submitting: boolean = false;

  subRef$: Subscription;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control({
      value: this.id,
      disabled: true,
    }),
    applicationUserId: [this.config.data.applicationUserId],
    port: ['', [Validators.required]],
    smtp: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`EmailData`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`EmailData/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }
  TestEmail(): void {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        `SendEmail/TestEmail/${this.applicationUserId}/${this.authService.infoEmployeeDto.personId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.testEmailMessage = resp.body.message;
          this.customToastService.onClose();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    if (this.applicationUserId !== null) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get<EmailDataAddOrEditDto>(
        `EmailData/GetByAccountId/${this.applicationUserId}`
      )
      .subscribe({
        next: (resp: any) => {
          console.log('🚀 ~ resp.body:', resp.body);
          if (resp.body !== null) {
            this.form.patchValue(resp.body);
            this.id = resp.body.id;
          }
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
