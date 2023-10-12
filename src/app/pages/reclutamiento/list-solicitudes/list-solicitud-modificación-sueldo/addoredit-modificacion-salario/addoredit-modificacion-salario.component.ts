import { CommonModule } from '@angular/common';
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
import { EStatus } from 'src/app/enums/estatus.enum';
import { cb_ESiNo } from 'src/app/enums/si-no.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-modificacion-salario',
  templateUrl: './addoredit-modificacion-salario.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [ToastService],
})
export default class AddoreditModificacionSalarioComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  cb_status = onGetSelectItemFromEnum(EStatus);
  cb_si_no: ISelectItemDto[] = cb_ESiNo;
  id: number = 0;
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    applicationUserId: [, Validators.required],
    confirmationFinish: [, Validators.required],
    currentSalary: [, Validators.required],
    employeeId: [, Validators.required],
    executionDate: [, Validators.required],
    finalSalary: [, Validators.required],
    folio: [, Validators.required],
    professionCurrentId: [, Validators.required],
    professionNewId: [, Validators.required],
    requestDate: [, Validators.required],
    retroactive: [, Validators.required],
    soport: [],
    status: [, Validators.required],
    workPositionId: [, Validators.required],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestSalaryModification/GetById/${this.id}`)
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

    this.subRef$ = this.dataService
      .put(`RequestSalaryModification/${this.id}`, this.form.value)
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}

export interface RequestSalaryModificationAddOrEditDto {
  employeeId: number;
  workPositionId: number;
  requestDate: string;
  soport: string;
  professionCurrentId: number;
  professionNewId: number;
  currentSalary: number;
  finalSalary: number;
  executionDate: string;
  folio: string;
  retroactive: boolean;
  status: EStatus;
  applicationUserId: string;
  confirmationFinish: boolean;
}
