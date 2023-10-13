import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-cont-minuta-pendientes-pdf',
  templateUrl: './cont-minuta-pendientes-pdf.component.html',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, SanitizeHtmlPipe],
  providers: [MessageService, CustomToastService],
})
export default class ConMinutaPendientesPdfComponent
  implements OnInit, OnDestroy
{
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);

  data: any[] = [];
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('ContabilidadMinuta/Pendientes/0')
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
