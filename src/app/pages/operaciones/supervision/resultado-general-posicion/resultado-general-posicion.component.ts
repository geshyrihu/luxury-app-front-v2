import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/interfaces/IFechasFiltro.interface';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-posicion',
  templateUrl: './resultado-general-posicion.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class ResultadoGeneralPosicionComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any;
  subRef$: Subscription;

  ngOnInit() {
    this.fechaInicial = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaFinal
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData(resp.fechaInicio, resp.fechaFinal);
    });
  }

  onLoadData(fechaInicio: string, fechaFinal: string) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`ResumenGeneral/Posicion/${fechaInicio}/${fechaFinal}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
