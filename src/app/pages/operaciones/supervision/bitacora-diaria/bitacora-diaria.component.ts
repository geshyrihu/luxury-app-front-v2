import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/interfaces/IFechasFiltro.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddOrEditBitacoraDiariaComponent from './add-or-edit-bitacora-diaria.component';
const base_url = environment.base_urlImg + 'Administration/accounts/';
@Component({
  selector: 'app-bitacora-diaria',
  templateUrl: './bitacora-diaria.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    TableModule,
    ToastModule,
    MultiSelectModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class BitacoraDiariaComponent implements OnInit, OnDestroy {
  private swalService = inject(SwalService);
  private dateService = inject(DateService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private dialogService = inject(DialogService);
  private selectItemService = inject(SelectItemService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  private toastService = inject(ToastService);

  loading: boolean = true;
  base_url = base_url;
  rangeDates: Date[] = [];
  ref: DynamicDialogRef;
  data: any[] = [];
  subRef$: Subscription;
  cb_user: any[] = [];
  cb_customers: any[] = [];
  cb_estatus: any[] = ['Terminado', 'Pendiente'];

  //TODO: REVISAR SERVICIO FECHASSERVICE
  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  employeeId = this.authService.infoEmployeeDto.employeeId;
  depto: string = 'SUPERVISIÓN DE OPERACIONES';
  nombre: string =
    this.authService.infoEmployeeDto.firstName +
    ' ' +
    this.authService.infoEmployeeDto.lastName;
  semana: string = this.fechaInicial + ' a ' + this.fechaFinal;

  ngOnInit(): void {
    this.onLoadUserSupervisor();
    this.selectItemService.getCustomersNombreCorto().subscribe((resp) => {
      this.cb_customers = resp;
    });
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`AgendaSupervision/GetAll/${this.fechaInicial}/${this.fechaFinal}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  onLoadUserSupervisor() {
    this.subRef$ = this.dataService
      .get('SelectItem/GetListSupervision')
      .subscribe({
        next: (resp: any) => {
          this.cb_user = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditBitacoraDiariaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      width: '40%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete('AgendaSupervision/' + data.id)
      .subscribe({
        next: () => {
          this.swalService.onClose();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
