import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IEditarCuentaDto } from 'src/app/interfaces/IEditarCuentaDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    CustomInputModule,
    NgbModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class UpdateAccountComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  private selectItemService = inject(SelectItemService);
  private customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  private customSwalService = inject(CustomSwalService);

  cb_customer: ISelectItemDto[] = this.selectItemService.customer;
  cb_employee: ISelectItemDto[] = !this.authService.onValidateRoles([
    'SuperUsuario',
  ])
    ? this.selectItemService.employeeFromCustomer
    : this.selectItemService.allEmployeeActive;
  cb_profession: ISelectItemDto[] = this.selectItemService.professions;
  submitting: boolean = false;

  @Input()
  applicationUserId: string = '';

  subRef$: Subscription;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.applicationUserId, disabled: true },
    userName: ['', Validators.required],
    email: [''],
    professionId: ['', Validators.required],
    customerId: ['', Validators.required],
    phoneNumber: [''],
    employeeId: [''],
    employeeActualId: [''],
    employeeName: [''],
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get<IEditarCuentaDto>(`Accounts/EditarCuenta/${this.applicationUserId}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          this.form.patchValue({
            employeeActualId: resp.body.employeeId,
          });
        },
        error: (err) => {
          this.customToastService.onShowError();
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
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.form.patchValue({
      employeeName: '',
    });

    this.subRef$ = this.dataService
      .put<IEditarCuentaDto>(
        `Accounts/EditarCuenta/${this.applicationUserId}`,
        this.form.value
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customSwalService.onClose();
          this.customToastService.onShowSuccess();
          this.submitting = false;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customSwalService.onClose();
        },
      });
  }

  onSaveEmployeeToAccount(e: any): void {
    let find = this.cb_employee.find(
      (x) => x.label.toLowerCase() === e.target.value.toLowerCase()
    );
    this.form.patchValue({
      employeeId: find?.value,
    });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
