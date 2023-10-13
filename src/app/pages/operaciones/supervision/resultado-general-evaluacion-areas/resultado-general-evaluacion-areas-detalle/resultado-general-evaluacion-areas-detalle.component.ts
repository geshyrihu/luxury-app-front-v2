import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/enums/estatus.enum';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/pipes/status.pipe';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-evaluacion-areas-detalle',
  templateUrl: './resultado-general-evaluacion-areas-detalle.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    TableModule,
    MultiSelectModule,
    SanitizeHtmlPipe,
    EStatusPipe,
  ],
  providers: [CustomToastService],
})
export default class ResultadoGeneralEvaluacionAreasDetalleComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);
  data: any;
  subRef$: Subscription;

  ngOnInit() {
    this.onLoadData(
      this.config.data.fecha,
      this.config.data.area,
      this.config.data.status
    );
  }

  onLoadData(fecha: string, area: EAreaMinutasDetalles, status?: EStatusTask) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`ResumenGeneral/EvaluacionAreasDetalle/${fecha}/${area}/${status}`)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
