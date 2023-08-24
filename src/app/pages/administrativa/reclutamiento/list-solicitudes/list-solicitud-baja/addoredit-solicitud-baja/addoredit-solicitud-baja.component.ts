import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EStatus } from 'src/app/enums/estatus.enum';
import { cb_ESiNo } from 'src/app/enums/si-no.enum';
import { ETypeOfDeparture } from 'src/app/enums/type-departure.enum';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-solicitud-baja',
  templateUrl: './addoredit-solicitud-baja.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [ToastService],
})
export default class AddoreditSolicitudBajaComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;

  cb_status: ISelectItemDto[] = onGetEnum(EStatus);
  cb_tipo_baja: ISelectItemDto[] = onGetEnum(ETypeOfDeparture);
  cb_si_no: ISelectItemDto[] = cb_ESiNo;

  id: number = 0;
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    reasonForLeaving: [],
    tipoBaja: [],
    executionDate: [],
    lawyerAssistance: [],
    employeeInformed: [],
    status: [],
    discounts: this.formBuilder.array([]),
    applicationUserId: [],
    employeeId: [],
    folio: [],
    requestDate: [],
    workPositionId: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestDismissal/GetById/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          console.log('🚀 ~ resp.body:', resp.body);
          this.form.patchValue(resp.body);
          // this.form.patchValue({
          //   id: resp.body.id,
          //   executionDate: resp.body.executionDate,
          //   status: resp.body.status,
          //   tipoBaja: resp.body.tipoBaja,
          //   reasonForLeaving: resp.body.reasonForLeaving,
          //   lawyerAssistance: resp.body.lawyerAssistance,
          //   employeeInformed: resp.body.employeeInformed,
          // });

          // Luego, recorre el arreglo de discounts y agrégalo al formArray 'discounts'
          resp.body.discounts.forEach((discount: any) => {
            this.discounts.push(
              this.formBuilder.group({
                description: discount.description,
                discount: discount.discount,
                id: discount.id,
              })
            );
          });
          console.log(this.form.value);
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`RequestDismissal/`, this.form.value)
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
        .put(`RequestDismissal/${this.id}`, this.form.value)
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

  addDiscountDescription() {
    const discountDescription = this.formBuilder.group({
      description: ['', Validators.required],
      discount: ['', Validators.required],
      id: ['', Validators.required],
    });
    this.discounts.push(discountDescription);
  }
  isControlInvalid(control: FormControl) {
    return control.invalid && (control.dirty || control.touched);
  }
  removeDiscountDescription(index: number, id: number) {
    console.log('🚀 ~ index:', index);
    console.log('🚀 ~ index:', id);
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`RequestDismissalDiscount/${id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
          this.discounts.removeAt(index);
        },
        error: (err) => {
          this.toastService.onShowError();
          this.swalService.onClose();
          console.log(err.error);
        },
      });
  }

  get discounts() {
    return this.form.get('discounts') as FormArray;
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
