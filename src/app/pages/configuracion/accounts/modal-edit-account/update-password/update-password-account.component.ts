import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ResetPasswordDto } from 'src/app/interfaces/auth/user-info.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import CustomButtonSubmitComponent from 'src/app/shared/custom-buttons/custom-button-submit/custom-button-submit.component';

@Component({
  selector: 'app-update-password-account',
  templateUrl: './update-password-account.component.html',
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
export default class UpdatePasswordAccountComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  public swalService = inject(SwalService);

  // password: string = '';
  @Input()
  applicationUserId: string = '';
  userInfoDto: ResetPasswordDto;
  subRef$: Subscription;
  form: FormGroup;
  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(this.applicationUserId),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*\/])/),
      ]),
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
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
