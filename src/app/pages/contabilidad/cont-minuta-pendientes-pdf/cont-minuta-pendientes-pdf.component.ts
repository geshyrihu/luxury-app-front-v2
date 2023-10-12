import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-cont-minuta-pendientes-pdf',
  templateUrl: './cont-minuta-pendientes-pdf.component.html',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, SanitizeHtmlPipe],
  providers: [MessageService, ToastService],
})
export default class ConMinutaPendientesPdfComponent
  implements OnInit, OnDestroy
{
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);

  data: any[] = [];
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('ContabilidadMinuta/Pendientes/0')
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
