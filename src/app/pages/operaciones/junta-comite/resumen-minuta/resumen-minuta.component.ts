import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { ReportService } from 'src/app/services/report.service';
import ComponentsModule from 'src/app/shared/components.module';
import ResumenMinutaGraficoComponent from '../resumen-minuta-grafico/resumen-minuta-grafico.component';

@Component({
  selector: 'app-resumen-minuta',
  templateUrl: './resumen-minuta.component.html',
  standalone: true,
  imports: [
    ResumenMinutaGraficoComponent,
    ComponentsModule,
    CommonModule,
    TableModule,
    SanitizeHtmlPipe,
  ],
  providers: [CustomToastService, MessageService],
})
export default class ResumenMinutaComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public reportService = inject(ReportService);
  public dataService = inject(DataService);
  public activatedRoute = inject(ActivatedRoute);
  public clipboard = inject(Clipboard);

  subRef$: Subscription;

  data: any[] = [];
  dataGrafico: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${this.activatedRoute.snapshot.params.meetingId}`
      )
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
    this.subRef$ = this.dataService
      .get(
        `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${this.activatedRoute.snapshot.params.meetingId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.dataGrafico = resp.body;
          this.reportService.setDataGrafico(resp.body);
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
