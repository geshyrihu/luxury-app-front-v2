import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { DataService } from 'src/app/services/data.service';
import { TicketFilterService } from 'src/app/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-haeder-customer',
  templateUrl: './haeder-customer.component.html',
  standalone: true,
})
export default class HaederCustomerComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);
  logoCustomer = '';
  nameCustomer = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  @Input()
  title: string = 'Titulo de cabecera';
  @Input()
  subTitle: string = '';

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe(
        (resp: any) => {
          this.nameCustomer = resp.body.nameCustomer;
          this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
        },
        (err) => {
          console.log(err.error);
        }
      );
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
