import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/enums/area-minutas-detalles.enum';
import {
  onGetNameEnumeration,
  onGetSelectItemFromEnum,
} from 'src/app/helpers/enumeration';
import { EAreaMinutasDetallesPipe } from 'src/app/pipes/area-minuta-detalles.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/pipes/status.pipe';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-filtro-minutas-area',
  templateUrl: './filtro-minutas-area.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    TableModule,
    EAreaMinutasDetallesPipe,
    SanitizeHtmlPipe,
    EStatusPipe,
  ],
  providers: [CustomToastService, MessageService],
})
export default class FiltroMinutasAreaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

  data: any[] = [];
  meetingId: number;
  area: number;
  areaName: string = '';
  titleEstatus: string = '';
  estatus: number;
  customerName: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadConfInitial();
    this.onLoadData();
  }

  onLoadConfInitial() {
    this.titleEstatus = this.config.data.titleEstatus;
    this.area = this.config.data.area;
    this.estatus = this.config.data.estatus;
    this.meetingId = this.config.data.meetingId;
    this.customerName = this.config.data.customerName;
    this.areaName = onGetNameEnumeration(
      onGetSelectItemFromEnum(EAreaMinutasDetalles),
      this.config.data.area
    );
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/FiltroMinutasArea/${this.meetingId}/${this.area}/${this.estatus}`
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
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
