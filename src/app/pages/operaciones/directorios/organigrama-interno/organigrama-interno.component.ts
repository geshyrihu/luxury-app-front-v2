import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-organigrama-interno',
  templateUrl: './organigrama-interno.component.html',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, NgbAlertModule],
  providers: [MessageService, CustomToastService],
})
export default class OrganigramaInternoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  nameCustomer: string = '';
  logoCustomer: string = '';
  data: any[] = [];
  baseUrlImg = environment.base_urlImg;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.OnLoadCustomer();
    this.customerId$.subscribe(() => {
      this.onLoadData();
      this.OnLoadCustomer();
    });
  }

  onLoadData() {
    console.log(this.customerIdService.getcustomerId());
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('OrganigramaInterno/' + this.customerIdService.getcustomerId())
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);

          this.customToastService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  OnLoadCustomer() {
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
