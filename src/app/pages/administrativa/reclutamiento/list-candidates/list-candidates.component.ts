import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';

const dateNow = new Date();

@Component({
  selector: 'app-list-candidates',
  templateUrl: './list-candidates.component.html',
  standalone: true,
  imports: [TableModule, ComponentsModule, FlatpickrModule],
  providers: [MessageService, ToastService],
})
export default class ListCandidatesComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  value: Date = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1); //Dia primero del mes actual
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    /**
     * Colocar calendario en español
     */
    flatpickrFactory();
    this.onLoadData();
  }

  onLoadData() {
    console.log('🚀 ~ value:', this.value);

    this.subRef$ = this.dataService
      .get(`Candidate/${this.dateService.formDateToString(this.value)}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
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
