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
import { ECountry } from 'src/app/core/enums/paises.enum';
import { IEmployeeAddOrEditDto } from 'src/app/core/interfaces/IEmployeeAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { phonePrefixes } from 'src/app/core/interfaces/phone-number-prefix';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
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
  providers: [DatePipe, CustomToastService],
})
export default class AddOrEditEmplopyeeComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public datepipe = inject(DatePipe);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public enumService = inject(EnumService);

  submitting: boolean = false;
  subRef$: Subscription;

  id = 0;

  // cb_sex = onGetSelectItemFromEnum(ESex);
  cb_sex: ISelectItemDto[] = [];
  // cb_education_level = onGetSelectItemFromEnum(EEducationLevel);
  cb_education_level: ISelectItemDto[] = [];
  // cb_area = onGetSelectItemFromEnum(EAreaResponsable);
  cb_area:ISelectItemDto[] = [];
  // cb_blood_type = onGetSelectItemFromEnum(EBloodType);
  cb_blood_type: ISelectItemDto[] = [];
  // cb_marital_status = onGetSelectItemFromEnum(EMaritalStatus);
  cb_marital_status: ISelectItemDto[] = [];
  cb_nationality = ECountry.GetEnum();
  // cb_type_contract = onGetSelectItemFromEnum(ETypeContract);
  cb_type_contract: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[];
  cb_phonePrefixes: any = phonePrefixes;
  cb_customer: ISelectItemDto[] = [];
  cb_state: ISelectItemDto[] = [];
  model: IEmployeeAddOrEditDto;
  form: FormGroup;

  formDataPersonalId = 0;
  formDataLaboralId = 0;
  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
    this.selectItemService.onGetSelectItem('Customers').subscribe((resp) => {
      this.cb_customer = resp;
    });

    this.enumService.getEnumValuesDisplay('EBloodType').subscribe((resp) => {
      this.cb_blood_type = resp;
    });

    this.enumService.onGetSelectItemEmun('ETypeContract').subscribe((resp) => {
      this.cb_type_contract = resp;
    });
    this.enumService.onGetSelectItemEmun('ESex').subscribe((resp) => {
      this.cb_sex = resp;
    });
    this.enumService.getEnumValuesDisplay('EState').subscribe((resp) => {
      this.cb_state = resp;
    });
    this.enumService.onGetSelectItemEmun('EMaritalStatus').subscribe((resp) => {
      this.cb_state = resp;
    });
    this.enumService
      .getEnumValuesDisplay('EEducationLevel')
      .subscribe((resp) => {
        this.cb_education_level = resp;
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
      phoneNumberPrefix: [],
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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .put(`Employees/${this.id}`, this.form.value)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.ref.close();
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

  onLoadData() {
    this.subRef$ = this.dataService.get(`Employees/${this.id}`).subscribe({
      next: (resp: any) => {
        this.model = resp.body;
        this.form.patchValue(this.model);
        this.onLoadPrefix(resp.body.phoneNumberPrefix);
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
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
