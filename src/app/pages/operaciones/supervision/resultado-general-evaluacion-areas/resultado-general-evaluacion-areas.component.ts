import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/enums/estatus.enum';
import { IFechasFiltro } from 'src/app/interfaces/IFechasFiltro.interface';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';
import ResultadoGeneralEvaluacionAreasDetalleComponent from './resultado-general-evaluacion-areas-detalle/resultado-general-evaluacion-areas-detalle.component';

@Component({
  selector: 'app-evaluacion-areas',
  templateUrl: './resultado-general-evaluacion-areas.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, TableModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class EvaluacionAreasComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any[] = [];
  subRef$: Subscription;
  ref: DynamicDialogRef;

  ngOnInit() {
    this.fechaInicial = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaFinal
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechasMOnth$.subscribe(
      (resp: IFechasFiltro) => {
        this.onLoadData(resp.fechaInicio, resp.fechaFinal);
      }
    );
  }
  onLoadData(fechaInicio: string, fechaFinal: string) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`ResumenGeneral/EvaluacionAreas/${fechaInicio}/${fechaFinal}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customToastService.onShowError();
          this.customSwalService.onClose();
        },
      });
  }

  onModalFiltroMinutasArea(
    fecha: string,
    area: EAreaMinutasDetalles,
    status?: EStatusTask
  ) {
    this.ref = this.dialogService.open(
      ResultadoGeneralEvaluacionAreasDetalleComponent,
      {
        data: {
          fecha,
          area,
          status,
        },
        width: '100%',
        height: '100%',
        closeOnEscape: true,
        baseZIndex: 10000,
        styleClass: 'customFullModal',
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
