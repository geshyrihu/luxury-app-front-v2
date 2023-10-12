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
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { cb_ESiNo } from 'src/app/enums/si-no.enum';
import { ETypeOfDeparture } from 'src/app/enums/type-departure.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-baja',
  templateUrl: './solicitud-baja.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CustomInputModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
  ],
})
export default class SolicitudBajaComponent implements OnInit {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public dateService = inject(DateService);
  public customerIdService = inject(CustomerIdService);
  public authService = inject(AuthService);

  data: any;
  id: number = 0;
  submitting: boolean = false;
  subRef$: Subscription;
  workPositionId: number = this.config.data.workPositionId;

  cb_type_departure: ISelectItemDto[] =
    onGetSelectItemFromEnum(ETypeOfDeparture);
  cb_si_no: ISelectItemDto[] = cb_ESiNo;

  form: FormGroup = this.formBuilder.group({
    id: [this.config.data.workPositionId],
    professionId: ['', Validators.required],
    employeeId: ['', Validators.required],
    profession: ['', Validators.required],
    professionKey: [],
    executionDate: ['', Validators.required],
    typeOfDeparture: ['', Validators.required],
    employee: ['', Validators.required],
    phoneEmployee: ['', Validators.required],
    reasonForLeaving: ['', Validators.required],
    discountDescriptions: this.formBuilder.array([]),
    lawyerAssistance: false, // Valor booleano directo
    employeeInformed: false, // Valor booleano directo
  });

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestDismissal/GetRequestDismissal/${this.workPositionId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
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

    var model = this.createFormData(this.form.value);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.dataService
      .post(
        `SolicitudesReclutamiento/SolicitudBaja/ 
          ${this.customerIdService.getcustomerId()}/${this.workPositionId}/${
          this.authService.infoUserAuthDto.applicationUserId
        }`,
        model
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });

    // Aquí puedes hacer lo que desees con el objeto `solicitud`
  }
  createFormData(form: any) {
    const formData = new FormData();

    if (this.filesForm.value.files != null) {
      for (var i = 0; i < this.filesForm.value.files.length; i++) {
        formData.append('supportFiles', this.filesForm.value.files[i]);
      }
    }
    formData.append('profession', form.profession);
    formData.append(
      'executionDate',
      this.dateService.getDateFormat(form.executionDate)
    );
    formData.append('typeOfDeparture', form.typeOfDeparture);
    formData.append('professionId', form.professionId);
    formData.append('employeeId', form.employeeId);
    formData.append('professionKey', form.professionKeyure);
    formData.append('employee', form.employee);
    formData.append('phoneEmployee', form.phoneEmployee);
    formData.append('reasonForLeaving', form.reasonForLeaving);
    formData.append('lawyerAssistance', form.lawyerAssistance.toString());
    formData.append('employeeInformed', form.employeeInformed.toString());
    // ...

    const discountDescriptions = form.discountDescriptions;
    for (let i = 0; i < discountDescriptions.length; i++) {
      const discountDescription = discountDescriptions[i];
      formData.append(
        `discountDescription[${i}].description`,
        discountDescription.description
      );
      formData.append(
        `discountDescription[${i}].price`,
        discountDescription.price.toString()
      );
    }

    // ...

    return formData;
  }
  isControlInvalid(control: FormControl) {
    return control.invalid && (control.dirty || control.touched);
  }
  addDiscountDescription() {
    const discountDescription = this.formBuilder.group({
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.discountDescriptions.push(discountDescription);
  }

  removeDiscountDescription(index: number) {
    this.discountDescriptions.removeAt(index);
  }

  get discountDescriptions() {
    return this.form.get('discountDescriptions') as FormArray;
  }

  //Carga de archivos....

  /**CARGA DRAG AND DROB */

  private filesControl = new FormControl<File[]>(
    null,
    FileUploadValidators.fileSize(20000)
  );

  public filesForm = new FormGroup({
    files: this.filesControl,
  });

  /**CARGA DRAG AND DROB */
  maxSizeExceeded: boolean = false;
  onFileChange() {
    this.maxSizeExceeded = false;
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    let sizeFile = 0;
    if (this.filesForm.value.files != null) {
      for (var i = 0; i < this.filesForm.value.files.length; i++) {
        sizeFile = sizeFile + this.filesForm.value.files[i].size;
      }
    }
    if (sizeFile > maxFileSize) this.maxSizeExceeded = true;
  }
}

export interface SolicitudBajaDto {
  profession: number;
  executionDate: string;
  employee: number;
  phoneEmployee: string;
  typeOfDeparture: ETypeOfDeparture;
  reasonForLeaving: string;
  discountDescription: DiscountDescription[];
  supportFiles: File[];
  lawyerAssistance: boolean;
  employeeInformed: boolean;
}

export interface DiscountDescription {
  description: string;
  price: number;
}
