import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
  SecurityService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputModule,
    ComponentsModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class LoginComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  public customToastService = inject(CustomToastService);

  fieldTextType!: boolean;
  form: FormGroup;
  subRef$: Subscription;
  returnUrl: string;

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.onLoadForm();
    this.securityService.resetAuthData();
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
        return;
      });
    }
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .post('Auth/login', this.form.value)
      .subscribe({
        next: (resp: any) => {
          this.onRemember(this.form.get('remember').value);
          this.router.navigateByUrl(localStorage.getItem('currentUrl'));
          this.securityService.setAuthData(resp.body.token);
          this.customToastService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customToastService.onClose();
          this.customToastService.onLoadingError(err.error['description']);
        },
      });
  }

  onRemember(remember: boolean) {
    if (remember) {
      localStorage.setItem('email', this.form.controls.email.value);
      localStorage.setItem('password', this.form.controls.password.value);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      email: [localStorage.getItem('email') || '', Validators.required],
      password: [localStorage.getItem('password') || '', Validators.required],
      remember: [true],
    });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }

  onRecopveryPassword() {
    this.router.navigate(['/auth/recuperar-contrasena']);
  }
}
