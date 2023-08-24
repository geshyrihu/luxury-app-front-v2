import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import ComponentsModule from 'src/app/shared/components.module';
import FiltroMinutasAreaComponent from '../filtro-minutas-area/filtro-minutas-area.component';
@Component({
  selector: 'app-minutas-resumen',
  templateUrl: './minutas-resumen.component.html',
  providers: [DialogService],
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
  ],
})
export default class MinutasResumenComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  public swalService = inject(SwalService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public selectItemService = inject(SelectItemService);
  public periodoMonthService = inject(PeriodoMonthService);
  ref: DynamicDialogRef;
  cb_customers: any[] = [];
  generalMinutas: any[] = [];
  generalMinutasGrupo: any[] = [];
  generalMinutasView: boolean = false;
  generalMinutasGrupoView: boolean = true;
  periodo: string = '';

  ngOnInit(): void {
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.selectItemService.getCustomersNombreCorto().subscribe((resp) => {
      this.cb_customers = resp;
    });
    this.onLoadData(
      this.dateService.formDateToString(
        this.periodoMonthService.getPeriodoInicio
      ),
      this.dateService.formDateToString(this.periodoMonthService.getPeriodoFin)
    );
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadData(
      this.dateService.formDateToString(
        this.periodoMonthService.getPeriodoInicio
      ),
      this.dateService.formDateToString(this.periodoMonthService.getPeriodoFin)
    );
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
  }

  onLoadData(fehcaInicio: string, fechaFinal: string) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ResumenMinutasGeneralLista/${fehcaInicio}/${fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
          this.generalMinutas = resp.body;
          this.swalService.onClose();
        },

        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ResumenMinutasGeneralGrupo/${fehcaInicio}/${fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
          this.generalMinutasGrupo = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  onModalFiltroMinutasArea(
    meetingId: number,
    area: number,
    titleEstatus: string,
    estatus: number,
    customerName: string
  ) {
    this.ref = this.dialogService.open(FiltroMinutasAreaComponent, {
      data: {
        meetingId,
        area,
        titleEstatus,
        estatus,
        customerName,
      },
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
      styleClass: 'customFullModal',
    });
  }
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
