import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EState } from 'src/app/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-ledger-accounts',
  templateUrl: './addoredit-ledger-accounts.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, CustomInputModule],
  providers: [CustomToastService],
})
export default class AddoreditLedgerAccountsComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  cb_state: ISelectItemDto[] = onGetSelectItemFromEnum(EState);

  applicationUserId: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  id: any = 0;
  form: FormGroup;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.onLoadData();
    }
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      numeroCuenta: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigoSat: ['000'],
      estate: ['', Validators.required],
      applicationUserId: [this.applicationUserId],
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
    this.customSwalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`Cuentas/`, this.form.value)
        .subscribe({
          next: () => {
            this.customSwalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            this.customToastService.onShowError();
            console.log(err.error);
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customSwalService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`Cuentas/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customSwalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customSwalService.onClose();
          },
        });
    }
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.get(`Cuentas/${this.id}`).subscribe({
      next: (resp) => {
        this.form.patchValue(resp.body);
        this.customSwalService.onClose();
      },
      error: (err) => {
        console.log(err.error);
        this.customSwalService.onClose();
      },
    });
  }

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
