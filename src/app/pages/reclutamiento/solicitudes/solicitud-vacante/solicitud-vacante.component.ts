import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { AutosizeDirective } from 'src/app/directives/autosize-text-area.diective';
import { ETurnoTrabajo } from 'src/app/enums/turno-trabajo.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-vacante',
  templateUrl: './solicitud-vacante.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    AutosizeDirective,
    CustomInputModule,
    TableModule,
  ],
})
export default class SolicitudVacanteComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);

  workPositionId: number = this.config.data.workPositionId;

  data: any;
  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;
  cb_turnoTrabajo: ISelectItemDto[] = onGetSelectItemFromEnum(ETurnoTrabajo);
  form: FormGroup = this.formBuilder.group({
    id: [this.config.data.workPositionId],
    professionName: [, Validators.required],
    sueldo: ['', [Validators.required, Validators.minLength(4)]],
    sueldoBase: ['', [Validators.required, Validators.minLength(4)]],
    turnoTrabajo: [0],
    lunesEntrada: [''],
    lunesSalida: [''],
    martesEntrada: [''],
    martesSalida: [''],
    miercolesEntrada: [''],
    miercolesSalida: [''],
    juevesEntrada: [''],
    juevesSalida: [''],
    viernesEntrada: [''],
    viernesSalida: [''],
    sabadoEntrada: [''],
    sabadoSalida: [''],
    domingoEntrada: [''],
    domingoSalida: [''],
    additionalInformation: [''],
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`WorkPosition/${this.workPositionId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.toastService.onShowError();
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
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .post(
        `SolicitudesReclutamiento/SolicitudVacante/${this.authService.infoUserAuthDto.applicationUserId}`,
        this.form.value
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
