import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { ResultadoGeneralService } from 'src/app/services/resultado-general.service';

@Component({
  selector: 'app-grafico-resultado-general',
  templateUrl: './resultado-general-grafico.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class ResultadoGeneralGraficoComponent implements OnInit {
  private resultadoGeneralService = inject(ResultadoGeneralService);
  private rangoCalendarioService = inject(FiltroCalendarService);

  tituloInicio: any = this.rangoCalendarioService.fechaFinal;
  tituloFin: any = this.rangoCalendarioService.fechaFinal;
  graficoMinutas: any = [];
  graficoMttoPreventivos: any = [];
  graficosMantenimiento: any = [];
  graficoMinutasContable: any = [];
  graficoMinutasOperaciones: any = [];
  graficoMinutasLegal: any = [];
  totalMinutasLegal: number = 0;
  totalMinutas: number = 0;
  totalMttoPreventivos: number = 0;
  totalsMantenimiento: number = 0;
  totalMinutasContable: number = 0;
  totalMinutasOperaciones: number = 0;

  ngOnInit(): void {
    this.onSetDataGraficos(this.resultadoGeneralService.dataGrafico);
  }

  onValidateNan(date): boolean {
    return !isNaN(date);
  }

  onSetDataGraficos(data: any) {
    this.graficoMinutas = [];
    this.graficoMttoPreventivos = [];
    this.graficosMantenimiento = [];
    this.graficoMinutasContable = [];
    this.graficoMinutasOperaciones = [];
    this.graficoMinutasLegal = [];
    data.forEach((element) => {
      if (element.concepto.label == 'Minuta') {
        this.graficoMinutas.push(element);
      }
      if (element.concepto.label == 'Mttos Preventivos') {
        this.graficoMttoPreventivos.push(element);
      }
      if (element.concepto.label == 'Mttos Correctivos') {
        this.graficosMantenimiento.push(element);
      }
      if (element.concepto.label == 'Minuta-Contable') {
        this.graficoMinutasContable.push(element);
      }
      if (element.concepto.label == 'Minuta-Operaciones') {
        this.graficoMinutasOperaciones.push(element);
      }
      if (element.concepto.label == 'Minuta-Legal') {
        this.graficoMinutasLegal.push(element);
      }
    });

    this.graficoMinutas = this.onFilter(this.graficoMinutas);
    this.graficoMttoPreventivos = this.onFilter(this.graficoMttoPreventivos);
    this.graficosMantenimiento = this.onFilter(this.graficosMantenimiento);
    this.graficoMinutasContable = this.onFilter(this.graficoMinutasContable);
    this.graficoMinutasOperaciones = this.onFilter(
      this.graficoMinutasOperaciones
    );
    this.graficoMinutasLegal = this.onFilter(this.graficoMinutasLegal);

    this.totalMinutasLegal = this.graficoMinutasLegal.evaluacionTerminado;
    this.totalMinutas = this.graficoMinutas.evaluacionTerminado;
    this.totalMttoPreventivos = this.graficoMttoPreventivos.evaluacionTerminado;
    this.totalsMantenimiento = this.graficosMantenimiento.evaluacionTerminado;
    this.totalMinutasContable = this.graficoMinutasContable.evaluacionTerminado;
    this.totalMinutasOperaciones =
      this.graficoMinutasOperaciones.evaluacionTerminado;
  }
  onLoadTotal(): number {
    return 0;
  }
  onFilter(data: any) {
    let grafico: any;
    let pendienteCount: number = 0;
    let terminadoCount: number = 0;

    data.forEach((resp) => {
      pendienteCount = pendienteCount + Number(resp.solicitudesPendientes);
      terminadoCount = terminadoCount + Number(resp.solicitudesAtendidas);
    });

    grafico = {
      totalTerminado: terminadoCount,
      evaluacionTerminado: this.onEvaluation(pendienteCount, terminadoCount),
      totalItems: pendienteCount + terminadoCount,
      totalPendiente: pendienteCount,
      evaluacionPendiente: this.onEvaluation(terminadoCount, pendienteCount),
      textEvaluacion: this.onLoadTitle(
        this.onEvaluation(pendienteCount, terminadoCount)
      ),
    };

    return grafico;
  }
  onEvaluation(pendiente: number, terminado: number): number {
    let total: number = pendiente + terminado;
    let procentajePositivo: number = terminado / total;
    let resultadoredondo: number = Math.round(procentajePositivo * 100);
    return resultadoredondo;
  }
  onLoadTitle(dataEvaluacion: any): string {
    if (dataEvaluacion <= 94) {
      return 'RIESGO';
    }
    if (dataEvaluacion >= 100) {
      return 'EXCELENTE';
    }
    if (dataEvaluacion >= 95 && dataEvaluacion <= 99) {
      return 'REGULAR';
    }
  }
}
