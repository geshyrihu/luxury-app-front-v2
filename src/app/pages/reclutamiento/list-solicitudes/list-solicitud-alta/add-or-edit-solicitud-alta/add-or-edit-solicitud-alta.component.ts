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
import { ETypeContractRegister } from 'src/app/enums/type-contract-register.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-solicitud-alta',
  templateUrl: './add-or-edit-solicitud-alta.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditSolicitudAltaComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  cb_status = onGetSelectItemFromEnum(EStatus);
  cb_typeContractRegister = onGetSelectItemFromEnum(ETypeContractRegister);
  id: number = 0;
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    requestPositionCandidateId: [],
    requestDate: ['', Validators.required],
    folio: [],
    executionDate: ['', Validators.required],
    typeContractRegister: ['', Validators.required],
    status: ['', Validators.required],
    applicationUserId: [],
    confirmationFinish: [],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestEmployeeRegister/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
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
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`RequestEmployeeRegister`, this.form.value)
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
        .put(`RequestEmployeeRegister/${this.id}`, this.form.value)
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
