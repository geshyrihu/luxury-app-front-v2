import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EStatusTask } from 'src/app/enums/estatus.enum';
import { EPriority } from 'src/app/enums/prioridad.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { IFilterTicket } from 'src/app/interfaces/IFilterTicket.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';
const diaActual = new Date(Date.now());
@Component({
  selector: 'app-addoredit-ticket',
  templateUrl: './addoredit-ticket.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    FlatpickrModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
  providers: [ToastService],
})
export default class AddoreditTicketComponent implements OnInit, OnDestroy {
  private customerSelectListService = inject(CustomerIdService);
  private dataService = inject(DataService);
  private dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  private toastService = inject(ToastService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public swalService = inject(SwalService);

  subRef$: Subscription;

  cb_priority = onGetSelectItemFromEnum(EPriority);
  cb_area_responsable: any[] = [];
  cb_status = onGetSelectItemFromEnum(EStatusTask);
  cb_user_customers: any[] = [];
  form: FormGroup;
  id: any = 0;
  model: any;
  panelDto: IFilterTicket;
  photoAfterFileUpdate: boolean = false;
  photoBeforeFileUpdate: boolean = false;
  urlBaseImg = '';

  isInRoleMantenimiento = false;
  SuperUsuario = false;
  Colaborador: boolean = true;

  title: string = '';
  // Enviando...
  status: EStatusTask;

  tipoDePut: number = 0;
  statusFolio: any;
  submitting: boolean = false;
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.title = this.config.header;
    this.status = this.config.data.status;
    flatpickrFactory();
    this.urlBaseImg = `${
      environment.base_urlImg
    }customers/${this.customerSelectListService.getcustomerId()}/report/`;
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);

    this.loadForm();
  }

  public saveResponsableId(e: any): void {
    let find = this.cb_user_customers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeResponsableId: find?.value,
    });
  }
  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('ResponsibleArea')
      .subscribe((resp) => {
        this.cb_area_responsable = resp;
      });
    this.selectItemService
      .onGetSelectItem(
        `GetUserCustomer/${this.customerSelectListService.getcustomerId()}`
      )
      .subscribe((resp) => {
        this.cb_user_customers = resp;
      });
  }

  public fechaProgramacion = this.dateService.formatDateTime(diaActual);
  public fechaLimite = this.dateService.formatDateTime(
    new Date(diaActual.setDate(diaActual.getDate() + 1))
  );

  loadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      activity: ['', Validators.required],
      dateFinished: [null],
      dateRequest: [this.dateService.getDateNow(), Validators.required],
      observations: [''],
      photoPathAfter: [''],
      photoPathBefore: [''],
      priority: [1, Validators.required],
      responsibleAreaId: [12, Validators.required],
      status: [this.status, Validators.required],
      customerId: [this.customerSelectListService.getcustomerId()],
      fechaProgamacion: [this.fechaProgramacion, Validators.required],
      fechaLimite: [this.fechaLimite, Validators.required],
      employeeResponsableId: ['', Validators.required],
      employeeResponsable: ['', Validators.required],
      employeeCargoReporte: [''],
      folioReporte: [true],
    });
  }

  onLoadData(id: number) {
    this.subRef$ = this.dataService.get(`Ticket/${id}`).subscribe(
      (resp: any) => {
        this.model = resp.body;
        this.form.patchValue(resp.body);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
  validarImagen(model: any): string | null {
    if (model) {
      return this.urlBaseImg + model;
    } else {
      return null;
    }
  }
  onCerrarFolio(status: EStatusTask) {
    const model = this.createFormData(this.form.value);
    this.subRef$ = this.dataService
      .put(`Ticket/UpdateInfo/${this.id}`, model)
      .subscribe({
        next: () => {
          this.onticketTerminado(status, model);
          this.ref.close(true);
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onticketTerminado(status: any, model: any) {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .put(`Ticket/${this.id}/${status}`, model)
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.swalService.onClose();
        },
      });
  }

  // Enviar por post un archivo adjunto

  // UpdateInfo
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const model = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService.post(`Ticket/Create`, model).subscribe({
        next: () => {
          this.ref.close(true);
          this.swalService.onClose();
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
        .put(`Ticket/UpdateInfo/${this.id}`, model)
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

  //Creación de FormData

  createFormData(dto: any) {
    const formData = new FormData();
    formData.append('dateRequest', String(dto.dateRequest));
    formData.append('activity', String(dto.activity));
    formData.append('observations', String(dto.observations));
    formData.append('status', String(dto.status));
    formData.append('priority', String(dto.priority));
    formData.append('customerId', String(dto.customerId));
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (dto.fechaProgamacion)
      formData.append(
        'fechaProgamacion',
        this.dateService.getDateFormat(dto.fechaProgamacion)
      );
    if (dto.fechaLimite)
      formData.append(
        'fechaLimite',
        this.dateService.getDateFormat(dto.fechaLimite)
      );
    if (dto.dateFinished)
      formData.append('dateFinished', String(dto.dateFinished));

    formData.append('employeeResponsableId', String(dto.employeeResponsableId));
    formData.append('folioReporte', dto.folioReporte);

    if (dto.photoPathAfter)
      formData.append('photoPathAfter', dto.photoPathAfter);

    if (dto.photoPathBefore)
      formData.append('photoPathBefore', dto.photoPathBefore);

    if (this.id != 0) {
      formData.append(
        'employeeCargoReporteId',
        String(dto.employeeCargoReporte)
      );
    } else {
      formData.append(
        'employeeCargoReporteId',
        String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
      );
    }

    return formData;
  }

  uploadFileAfter(file: File) {
    this.photoAfterFileUpdate = true;
    this.form.patchValue({ photoPathAfter: file });
  }
  uploadFileBefore(file: File) {
    this.photoBeforeFileUpdate = true;
    this.form.patchValue({ photoPathBefore: file });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
