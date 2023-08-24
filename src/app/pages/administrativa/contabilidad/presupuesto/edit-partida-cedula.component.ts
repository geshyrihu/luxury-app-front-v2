import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CedulaPresupuestalDetalleAddOrEdit } from 'src/app/interfaces/ICedulaPresupuestalDetalleAddOrEdit.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-edit-partida-cedula',
  templateUrl: './edit-partida-cedula.component.html',
  standalone: true,
  imports: [ComponentsModule, ReactiveFormsModule, CustomInputModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class EditPartidaCedulaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public toastService = inject(ToastService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);
  private swalService = inject(SwalService);

  submitting: boolean = false;
  subRef$: Subscription;

  applicationUserId: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  id: any = 0;
  form: FormGroup;
  chartOfAccount: string = '';
  descripcion: string = '';

  ngOnInit() {
    this.id = this.config.data.id;
    this.loadItem();
  }

  onSubmit() {
    const budgetCardDTO: CedulaPresupuestalDetalleAddOrEdit = this.form.value;
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`CedulaPresupuestalDetalles`, budgetCardDTO)
        .subscribe({
          next: () => {
            this.swalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.toastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.swalService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`CedulaPresupuestalDetalles/${this.id}`, budgetCardDTO)
        .subscribe({
          next: () => {
            this.swalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.toastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.swalService.onClose();
          },
        });
    }
  }
  loadItem() {
    this.form = this.formBuilder.group({
      id: [this.id],
      cuentaId: [0],
      cedulaPresupuestalId: [''],
      presupuestoMensual: [0, Validators.required],
      applicationUserId: [''],
      presupuestoEjercido: [],
    });
    this.subRef$ = this.dataService
      .get(`CedulaPresupuestalDetalles/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.descripcion = resp.body.cuenta.descripcion;
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
