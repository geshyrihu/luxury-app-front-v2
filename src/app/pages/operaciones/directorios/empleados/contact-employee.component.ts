import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ERelationEmployee } from 'src/app/enums/relacion-empleado.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-contact-employee',
  templateUrl: './contact-employee.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    ToastModule,
    NgxMaskModule,
  ],
  providers: [MessageService, ConfirmationService, ToastService],
})
export default class ContactEmployeeComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);

  id: number;
  idEmployee: number;
  cb_contactEmployee: any[] = onGetSelectItemFromEnum(ERelationEmployee);
  showButtonAddOrCancel: boolean = false;
  contactEmployeeAdd: any;
  submitting: boolean = false;
  subRef$: Subscription;

  data: any[] = [];
  form: FormGroup;

  ngOnInit(): void {
    this.idEmployee = this.config.data.id;
    this.onLoadForm();
    this.getContactEmployees();
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      relacion: ['', Validators.required],
      phoneOne: ['', Validators.required],
      phoneTwo: [''],
      employeeId: [this.idEmployee, Validators.required],
    });
  }

  getContactEmployees() {
    this.subRef$ = this.dataService
      .get(`ContactEmployees/GetAsyncAll/${this.idEmployee}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  onUpdate(item: any) {
    this.subRef$ = this.dataService
      .put(`ContactEmployees/${item.id}`, item)
      .subscribe((resp: any) => {
        this.toastService.onShowSuccess();
        this.getContactEmployees();
      });
  }
  onDelete(item: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ContactEmployees/${item.id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.getContactEmployees();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
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

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .post(`ContactEmployees`, this.form.value)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.showButtonAddOrCancel = false;
          this.getContactEmployees();
          this.onLoadForm();
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
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
