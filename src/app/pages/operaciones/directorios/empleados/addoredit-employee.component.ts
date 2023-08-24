import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EAreaResponsable } from 'src/app/enums/area-responsable.enum';
import { EMaritalStatus } from 'src/app/enums/estado-civil.enum';
import { EEducationLevel } from 'src/app/enums/nivel-educacion.enum';
import { ECountry } from 'src/app/enums/paises.enum';
import { EBloodType } from 'src/app/enums/tipo-sangre.enum';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { IEmployeeAddOrEditDto } from 'src/app/interfaces/IEmployeeAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
// import { ESex } from 'src/app/enums/sexo.enum';
import { Subscription } from 'rxjs';
import { ESex } from 'src/app/enums/sexo.enum';
import { ETypeContract } from 'src/app/enums/tipo-contrato.enum';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';

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
  cb_profession: any[] = [];
  cb_customer: any[] = [];
  cb_state = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];
  model: IEmployeeAddOrEditDto;
  form: FormGroup;

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('customers')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_customer = items;
      });
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
  }

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birth: ['', Validators.required],
      active: ['', Validators.required],
      professionId: ['', Validators.required],
      customerId: ['', Validators.required],
      correoPersonal: ['', Validators.required],
      celularPersonal: [''],
      salary: [''],
      typeContract: ['', Validators.required],
      curp: [''],
      rfc: [''],
      nss: [''],
      sex: ['', Validators.required],
      dateAdmission: ['', Validators.required],
      address: [''],
      localPhone: [''],
      bloodType: [''],
      nationality: ['Mexico', Validators.required],
      maritalStatus: [''],
      educationLevel: [''],
      area: ['', Validators.required],
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
    // const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post('Employees', this.form.value)
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
        .put(`Employees/${this.id}`, this.form.value)
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
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Employees/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.model.dateAdmission = this.datepipe.transform(
          this.model.dateAdmission,
          'yyyy-MM-dd'
        );
        this.form.patchValue(this.model);
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
