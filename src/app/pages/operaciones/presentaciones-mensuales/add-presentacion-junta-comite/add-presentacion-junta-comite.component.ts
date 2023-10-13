import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
} from 'src/app/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';

@Component({
  selector: 'app-add-presentacion-junta-comite',
  templateUrl: './add-presentacion-junta-comite.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    FlatpickrModule,
    CommonModule,
  ],
  providers: [CustomToastService],
})
export default class AddPresentacionJuntaComiteComponent implements OnDestroy {
  public dateService = inject(DateService);
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';
  errorMessage: string = '';
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getcustomerId()],
    fechaCorrespondiente: ['', Validators.required],
    fechaJunta: [''],
  });

  onLoadData(id: number) {
    flatpickrFactory();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
    this.subRef$ = this.dataService
      .get('PresentacionJuntaComite/Get/' + id)
      .subscribe({
        next: (resp: any) => {
          resp.body.fechaCorrespondiente = this.dateService.getDateFormat(
            resp.body.fechaCorrespondiente
          );
          resp.body.fechaJunta = this.dateService.getDateFormat(
            resp.body.fechaJunta
          );
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  get f() {
    return this.form.controls;
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
        .post(`PresentacionJuntaComite/AddFecha`, this.form.value)
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
        .put(`PresentacionJuntaComite/AddFecha/${this.id}`, this.form.value)
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
