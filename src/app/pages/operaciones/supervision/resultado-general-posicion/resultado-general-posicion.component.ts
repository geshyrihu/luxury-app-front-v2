import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/interfaces/IFechasFiltro.interface';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-posicion',
  templateUrl: './resultado-general-posicion.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, TableModule],
  providers: [MessageService, ToastService],
})
export default class ResultadoGeneralPosicionComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any;
  subRef$: Subscription;

  ngOnInit() {
    this.fechaInicial = this.dateService.formDateToString(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateService.formDateToString(
      this.rangoCalendarioService.fechaFinal
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData(resp.fechaInicio, resp.fechaFinal);
    });
  }

  onLoadData(fechaInicio: string, fechaFinal: string) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`ResumenGeneral/Posicion/${fechaInicio}/${fechaFinal}`)
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
