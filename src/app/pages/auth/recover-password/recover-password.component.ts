import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import CustomButtonComponent from 'src/app/shared/custom-buttons/custom-button/custom-button.component';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputModule,
    CustomButtonComponent,
  ],
})
export default class RecoverPasswordComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public swalService = inject(SwalService);

  form: FormGroup;
  sendEmail: boolean = false;
  subRef$: Subscription;
  ngOnInit(): void {
    this.onLoadForm();
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.required,
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .post('Auth/RecoverPassword', this.form.value)
      .subscribe({
        next: () => {
          this.swalService.onClose();
          this.sendEmail = true;
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onLoadingError(err.error[''].errors[0].errorMessage);
        },
      });
  }

  onLogin() {
    this.router.navigateByUrl('/auth/login');
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
