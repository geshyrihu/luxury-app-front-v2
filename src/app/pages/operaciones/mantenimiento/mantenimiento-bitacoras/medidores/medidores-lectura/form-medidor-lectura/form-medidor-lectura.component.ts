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
import { IMedidorLecturaDto } from 'src/app/interfaces/IMedidorLecturaDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
const date = new Date();
@Component({
  selector: 'app-form-medidor-lectura',
  templateUrl: './form-medidor-lectura.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ComponentsModule],
  providers: [ToastService],
})
export default class FormMedidorLecturaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public dateService = inject(DateService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  dateString: string = this.dateService.formDateToString(date);
  dateStringUltimoRegistro: string = '';
  seRegistroEsteDia: boolean = false;
  seRegistroEsteDiaMensaje: string = 'Ya se cargo el registro de este día';
  id: number = 0;
  ultimaLectura: number = 0;
  medidorId: number = 0;
  cb_nombreMedidorCategoria: any[] = [];
  form: FormGroup;

  validarUltimaLectura() {
    if (this.dateString === this.dateStringUltimoRegistro) {
      this.seRegistroEsteDia = true;
    } else {
      this.seRegistroEsteDia = false;
    }
  }
  ngOnInit(): void {
    this.id = this.config.data.id;
    this.medidorId = this.config.data.medidorId;
    this.subRef$ = this.dataService
      .get(`MedidorLectura/UltimaLectura/${this.medidorId}`)
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.dateStringUltimoRegistro = this.dateService.formDateToString(
              resp.body.fechaRegistro
            );
            this.validarUltimaLectura();
            this.ultimaLectura = resp.body.lectura;
          }
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      medidorId: [this.medidorId],
      fechaRegistro: [''],
      lectura: ['', Validators.required],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get<IMedidorLecturaDto>(`MedidorLectura/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (this.form.value.lectura == 0) {
      return;
    }
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`MedidorLectura`, this.form.value)
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
        .put(`MedidorLectura/${this.id}`, this.form.value)
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
  laLecturaEsMenor = false;
  evaluarLectura(event: any) {
    if (
      event.target.value < Number(this.ultimaLectura) &&
      this.ultimaLectura !== 0
    ) {
      this.laLecturaEsMenor = true;
    } else {
      this.laLecturaEsMenor = false;
    }
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
  get f() {
    return this.form.controls;
  }
}
