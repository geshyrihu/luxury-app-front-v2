import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { toBase64 } from 'src/app/helpers/utilities';
import { UserInfoDto } from 'src/app/interfaces/auth/user-info.interface';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-account-customer',
  templateUrl: './add-account-customer.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
})
export default class AddAccountCustomerComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public selectItemService = inject(SelectItemService);
  public swalService = inject(SwalService);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  subRef$: Subscription;

  noImg = `${environment.base_urlImg}no-img.png`;
  imgBase64: string = '';

  imagen: File;
  cb_profession: any[] = [];
  dataError = '';
  data: UserInfoDto;
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birth: ['', Validators.required],
    celularPersonal: ['', Validators.required],
    professionId: ['', Validators.required],
    photoPath: ['', Validators.required],
    correoPersonal: ['', [Validators.required]],
  });
  register() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .post('Employees/CreateEmployee', formData)
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          err.error.forEach((x) => {
            this.dataError = this.dataError + x['description'] + ' ';
          });
          this.swalService.onLoadingError(this.dataError);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });
  }

  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
  }

  get f() {
    return this.form.controls;
  }
  private createFormData(model: any): FormData {
    const formData = new FormData();

    formData.append('birth', this.dateService.formDateToString(model.birth));
    formData.append('correoPersonal', model.correoPersonal);
    formData.append(
      'customerId',
      String(this.customerIdService.getcustomerId())
    );
    formData.append('firstName', model.firstName);
    formData.append('lastName', model.lastName);
    formData.append('celularPersonal', model.celularPersonal);
    formData.append('professionId', model.professionId);

    if (this.imagen) {
      formData.append('photoPath', this.imagen);
    }

    return formData;
  }

  change(event: any): void {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      toBase64(file)
        .then((value: string) => {
          this.imgBase64 = value;
        })
        .catch((error) => console.log(error));
      this.imagen = file;
    }
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
