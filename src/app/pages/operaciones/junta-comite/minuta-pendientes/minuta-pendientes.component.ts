import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/pipes/status.pipe';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-minuta-pendientes',
  templateUrl: './minuta-pendientes.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, EStatusPipe, SanitizeHtmlPipe],
  providers: [MessageService, CustomToastService],
})
export default class MinutaPendientesComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  data: any[] = [];
  todoElSeguimiento: boolean = true;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Meetings/MinutaAllPendientes/${this.customerIdService.getcustomerId()}`
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
