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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`Cuentas/`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onCloseToSuccess();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`Cuentas/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.get(`Cuentas/${this.id}`).subscribe({
      next: (resp) => {
        this.form.patchValue(resp.body);
        this.customToastService.onClose();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
