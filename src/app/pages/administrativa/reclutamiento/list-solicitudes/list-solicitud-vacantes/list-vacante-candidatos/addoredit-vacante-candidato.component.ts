import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EDecisionCandidadoReclutamiento } from 'src/app/enums/EDecisionCandidadoReclutamiento';
import { EFuenteReclutamiento } from 'src/app/enums/EFuenteReclutamiento';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-vacante-candidato',
  templateUrl: './addoredit-vacante-candidato.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [DatePipe, ToastService],
})
export default class AddOrEditVacanteCandidatoComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public datePipe = inject(DatePipe);
  public dateService = inject(DateService);
  public ref = inject(DynamicDialogRef);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;
  file: any = null;

  cb_fuentesReclutamiento: ISelectItemDto[] = onGetEnum(EFuenteReclutamiento);
  cb_decision: ISelectItemDto[] = onGetEnum(EDecisionCandidadoReclutamiento);

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    firstName: ['', Validators.required],
    positionRequestId: [
      this.config.data.positionRequestId,
      Validators.required,
    ],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    birthDate: ['', Validators.required],
    fuente: [0, Validators.required],
    phone: ['', Validators.required],
    date: ['', Validators.required],
    hour: ['', Validators.required],
    decision: [''],
    comments: [],
    sendMail: [false],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;

    if (this.config.data.positionRequestId !== null) {
      this.form.patchValue({
        positionRequestId: this.config.data.positionRequestId,
      });
    }
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestPositionCandidate/${this.id}`)
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
    const model = this.onCreateFormData(this.form.value);
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`RequestPositionCandidate`, model)
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
        .put(`RequestPositionCandidate/${this.id}`, model)
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

  get f() {
    return this.form.controls;
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('positionRequestId', String(dto.positionRequestId));
    formData.append('firstName', dto.firstName);
    formData.append('lastName', dto.lastName);
    formData.append('email', dto.email);
    formData.append(
      'birthDate',
      this.dateService.formDateToString(dto.birthDate)
    );
    formData.append('fuente', String(dto.fuente));
    formData.append('phone', dto.phone);
    formData.append('decision', dto.decision);
    formData.append('date', this.dateService.formDateToString(dto.date));
    formData.append('hour', String(dto.hour));
    formData.append('sendMail', String(dto.sendMail));
    formData.append(
      'applicationUserId',
      this.authService.infoUserAuthDto.applicationUserId
    );
    if (this.file != null) {
      formData.append('curriculumn', this.file);
    }

    return formData;
  }
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
