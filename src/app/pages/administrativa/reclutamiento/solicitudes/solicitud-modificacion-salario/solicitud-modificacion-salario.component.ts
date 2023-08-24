import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
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
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-modificacion-salario',
  templateUrl: './solicitud-modificacion-salario.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CustomInputModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
  ],
})
export default class SolicitudModificacionSalarioComponent {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dateService = inject(DateService);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);

  workPositionId: number = this.config.data.workPositionId;
  data: any;
  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;

  cb_profession: ISelectItemDto[] = [];
  cb_si_no: ISelectItemDto[] = cb_ESiNo;

  form: FormGroup = this.formBuilder.group({
    employeeId: ['', Validators.required],
    employeeName: ['', Validators.required],
    professionCurrentId: [],
    professionCurrent: [],
    professionNewId: [],
    professionNew: [],
    currentSalary: ['', Validators.required],
    finalSalary: ['', [Validators.required, Validators.min(1)]],
    executionDate: ['', Validators.required],
    retroactive: [false, Validators.required],
    additionalInformation: [''],
  });

  ngOnInit(): void {
    this.subRef$ = this.selectItemService
      .onGetSelectItem(`Professions`)
      .subscribe((resp) => {
        this.cb_profession = resp;
      });
    this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(
        `RequestSalaryModification/GetDataForModificacionSalario/${this.workPositionId}`
      )
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
        `SolicitudesReclutamiento/SolicitudModificacionSalario/${this.customerIdService.getcustomerId()}/${
          this.authService.infoUserAuthDto.applicationUserId
        } `,
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
        formData.append('soport', this.filesForm.value.files[i]);
      }
    }

    formData.append('employeeId', form.employeeId);
    formData.append('currentSalary', form.currentSalary);
    formData.append('professionCurrent', form.professionCurrent);
    formData.append('professionCurrentId', form.professionCurrentId);
    formData.append('professionNewId', form.professionNewId);
    formData.append('professionNew', form.professionNew);
    formData.append('employeeName', form.employeeName);
    formData.append('finalSalary', form.finalSalary);
    formData.append('workPositionId', this.config.data.workPositionId);
    formData.append(
      'executionDate',
      this.dateService.formDateToString(form.executionDate)
    );
    formData.append('retroactive', form.retroactive);
    formData.append('additionalInformation', form.additionalInformation);

    return formData;
  }
  isControlInvalid(control: FormControl) {
    return control.invalid && (control.dirty || control.touched);
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

  public onSaveProfessionIdToAccount(e: any): void {
    let find = this.cb_profession.find(
      (x) => x.label.toLowerCase() === e.target.value.toLowerCase()
    );

    this.form.patchValue({
      professionNewId: find?.value,
      professionNew: find?.label,
    });
  }
}
