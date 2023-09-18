import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EAreaResponsable } from 'src/app/enums/area-responsable.enum';
import { EMaritalStatus } from 'src/app/enums/estado-civil.enum';
import { EEducationLevel } from 'src/app/enums/nivel-educacion.enum';
import { ECountry } from 'src/app/enums/paises.enum';
import { ESex } from 'src/app/enums/sexo.enum';
import { ETypeContract } from 'src/app/enums/tipo-contrato.enum';
import { EBloodType } from 'src/app/enums/tipo-sangre.enum';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { IEmployeeAddOrEditDto } from 'src/app/interfaces/IEmployeeAddOrEditDto.interface';
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

  cb_sex = onGetEnum(ESex);
  cb_education_level = onGetEnum(EEducationLevel);
  cb_area = onGetEnum(EAreaResponsable);
  cb_blood_type = onGetEnum(EBloodType);
  cb_marital_status = onGetEnum(EMaritalStatus);
  cb_nationality = ECountry.GetEnum();
  cb_type_contract = onGetEnum(ETypeContract);

  cb_state = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];
  model: IEmployeeAddOrEditDto;
  formDataPersonal: FormGroup;
  form: FormGroup;
  formDataLaboral: FormGroup;

  formDataPersonalId = 0;
  formDataLaboralId = 0;
  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      firstName: [],
      lastName: [],
      active: [],
      photoPath: [],
      correoPersonal: [],
      celularPersonal: [],
      dateCreation: [],
      typeContract: [],
      applicationUserId: [],
    });
    this.formDataPersonal = this.formBuilder.group({
      employeeId: [],
      curp: [],
      rfc: [],
      nss: [],
      sex: [],
      address: [],
      localPhone: [],
      bloodType: [],
      nationality: [],
      maritalStatus: [],
      educationLevel: [],
      birthDate: [],
    });
    this.formDataLaboral = this.formBuilder.group({
      employeeId: [],
      admissionDate: [],
      salary: [],
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
          this.onLoadData();
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
  submitformDataPersonal() {
    if (this.formDataPersonal.invalid) {
      Object.values(this.formDataPersonal.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .put(
        `Employees/PostEmployeeDataPersonal/${this.formDataPersonalId}`,
        this.formDataPersonal.value
      )
      .subscribe({
        next: () => {
          this.swalService.onClose();
          this.onLoadData();
          this.submitting = false;
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
  submitformDataLaboral() {
    if (this.formDataLaboral.invalid) {
      Object.values(this.formDataLaboral.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    // const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .put(
        `Employees/PostEmployeeDataLaboral/${this.formDataLaboralId}`,
        this.formDataLaboral.value
      )
      .subscribe({
        next: () => {
          this.swalService.onClose();
          this.onLoadData();
          this.submitting = false;
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
      .get(`Employees/GetEmployeeDataPersonal/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.formDataPersonalId = resp.body.id;
        console.log('🚀 ~ GetEmployeeDataPersonal:', resp.body);
        this.formDataPersonal.patchValue(this.model);
      });
    this.subRef$ = this.dataService
      .get(`Employees/GetEmployeeDataLaboral/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.formDataLaboralId = resp.body.id;
        console.log('🚀 ~ GetEmployeeDataLaboral:', resp.body);

        this.formDataLaboral.patchValue(this.model);
      });
    this.subRef$ = this.dataService
      .get(`Employees/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        console.log('🚀 ~ GetEmployeeDataLaboral:', resp.body);
        this.form.patchValue(this.model);
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
export interface EmployeeLaborData {
  id: number;
  employeeId: number;
  admissionDate: string | null;
  salary: number;
}
export interface EmployeePersonalData {
  id: number;
  employeeId: number;
  curp: string;
  rFC: string;
  nSS: string;
  sex: ESex;
  address: string;
  localPhone: string;
  bloodType: EBloodType;
  nationality: string;
  maritalStatus: EMaritalStatus;
  educationLevel: EEducationLevel;
  birthDate: string;
}
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  active: boolean;
  photoPath: string;
  correoPersonal: string;
  celularPersonal: string;
  dateCreation: string;
  typeContract: ETypeContract;
  applicationUserId: string;
}
