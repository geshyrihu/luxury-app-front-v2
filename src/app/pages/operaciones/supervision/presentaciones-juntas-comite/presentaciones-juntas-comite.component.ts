import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import { ViewPdfService } from 'src/app/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-presentaciones-juntas-comite',
  templateUrl: './presentaciones-juntas-comite.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, FormsModule, PrimeNgModule],
  providers: [MessageService, ToastService],
})
export default class PresentacionesJuntasComiteComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  private route = inject(Router);
  private viewPdfService = inject(ViewPdfService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  data: any[] = [];
  periodo: string = this.dateService.onParseToInputMonth(
    this.rangoCalendarioService.fechaInicial
  );

  subRef$: Subscription;
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    let inicial = this.dateService.getDateFormat(
      new Date(this.periodo + '-' + 1)
    );
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`PresentacionJuntaComite/Generales/${inicial}/`)
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

  navigateToPdf(url: string) {
    this.viewPdfService.setNameDocument(url);
    this.route.navigate(['documento/view-documento']);
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
