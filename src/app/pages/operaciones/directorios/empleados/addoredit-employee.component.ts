import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EAreaResponsable } from 'src/app/enums/area-responsable.enum';
import { EMaritalStatus } from 'src/app/enums/estado-civil.enum';
import { EEducationLevel } from 'src/app/enums/nivel-educacion.enum';
import { ECountry } from 'src/app/enums/paises.enum';
import { ESex } from 'src/app/enums/sexo.enum';
import { ETypeContract } from 'src/app/enums/tipo-contrato.enum';
import { EBloodType } from 'src/app/enums/tipo-sangre.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { IEmployeeAddOrEditDto } from 'src/app/interfaces/IEmployeeAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { phonePrefixes } from 'src/app/interfaces/phone-number-prefix';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit',
  templateUrl: './addoredit-employee.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [DatePipe, ToastService],
})
export default class AddOrEditEmplopyeeComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public selectItemService = inject(SelectItemService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public datepipe = inject(DatePipe);
  public customerIdService = inject(CustomerIdService);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id = 0;

  cb_sex = onGetSelectItemFromEnum(ESex);
  cb_education_level = onGetSelectItemFromEnum(EEducationLevel);
  cb_area = onGetSelectItemFromEnum(EAreaResponsable);
  cb_blood_type = onGetSelectItemFromEnum(EBloodType);
  cb_marital_status = onGetSelectItemFromEnum(EMaritalStatus);
  cb_nationality = ECountry.GetEnum();
  cb_type_contract = onGetSelectItemFromEnum(ETypeContract);
  cb_profession: ISelectItemDto[];
  cb_phonePrefixes: any = phonePrefixes;

  cb_state = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];
  model: IEmployeeAddOrEditDto;
  form: FormGroup;

  formDataPersonalId = 0;
  formDataLaboralId = 0;
  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
    flatpickrFactory();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      firstName: [, Validators.required],
      lastName: [, Validators.required],
      active: [],
      address: [],
      birth: [],
      bloodType: [],
      celularPersonal: [, Validators.required],
      correoPersonal: [, Validators.required],
      curp: [],
      customerId: [],
      dateAdmission: [],
      dateCreation: [],
      educationLevel: [],
      localPhone: [],
      maritalStatus: [],
      nationality: [],
      nss: [],
      personId: [],
      phoneNumberPrefix: [, Validators.required],
      photoPath: [],
      professionId: [],
      rfc: [],
      salary: [],
      sex: [],
      typeContract: [],
    });
  }

  submit() {
    this.form.patchValue({
      id: this.id,
    });
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.submitting = true;
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .put(`Employees/${this.id}`, this.form.value)
      .subscribe({
        next: () => {
          this.swalService.onClose();
          this.submitting = false;
          this.ref.close();
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

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Employees/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.form.patchValue(this.model);
        this.onLoadPrefix(resp.body.phoneNumberPrefix);
      });
  }

  onLoadPrefix(phoneNumberPrefix: string) {
    this.cb_phonePrefixes.find((x) => {
      x?.prefix === phoneNumberPrefix;
      this.form.patchValue({
        phoneNumberPrefix: `${x.country} ${x.prefix}`,
      });
    });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
