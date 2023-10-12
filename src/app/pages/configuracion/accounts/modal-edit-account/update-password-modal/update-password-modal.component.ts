import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ResetPasswordDto } from 'src/app/interfaces/auth/user-info.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import CustomButtonSubmitComponent from 'src/app/shared/custom-buttons/custom-button-submit/custom-button-submit.component';

@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  standalone: true,
  imports: [
    NgbModule,
    FormsModule,
    ToastModule,
    CustomButtonSubmitComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService, ToastService],
})
export default class UpdatePasswordModalComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  public swalService = inject(SwalService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  applicationUserId: string = this.config.data.applicationUserId;
  userInfoDto: ResetPasswordDto;
  subRef$: Subscription;
  form: FormGroup;

  correoPersonal: string = '';
  celularPersonal: string = '';

  ngOnInit(): void {
    this.onLoadDataEmployee();
    this.form = new FormGroup({
      id: new FormControl(this.applicationUserId),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*\/])/),
      ]),
    });
  }

  onLoadDataEmployee() {
    this.subRef$ = this.dataService
      .get(
        `Employees/DataEmployeeForRecoveryPassword/${this.applicationUserId}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.correoPersonal = resp.body.correoPersonal;
            this.celularPersonal = resp.body.celularPersonal;
          }
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .post('Auth/ResetPasswordAdmin', this.form.value)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  SendPasswordNewEmail() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get(
        'Auth/SendPasswordNewEmail/' +
          this.correoPersonal +
          '/' +
          this.applicationUserId
      )
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  SendPasswordWhatsApp() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get(
        'Auth/SendPasswordWhatsApp/' +
          this.celularPersonal +
          '/' +
          this.applicationUserId
      )
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
