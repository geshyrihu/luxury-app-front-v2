import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organigrama',
  templateUrl: './organigrama.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class OrganigramaComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  data: TreeNode[];
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  base_urlImg = `${environment.base_urlImg}Administration/accounts/`;

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('EntregaRecepcion/Organigrama/' + this.customerIdService.customerId)
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
