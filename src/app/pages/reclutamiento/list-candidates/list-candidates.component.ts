import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';

const dateNow = new Date();

@Component({
  selector: 'app-list-candidates',
  templateUrl: './list-candidates.component.html',
  standalone: true,
  imports: [TableModule, ComponentsModule, FlatpickrModule],
  providers: [MessageService, CustomToastService],
})
export default class ListCandidatesComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

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
    this.subRef$ = this.dataService
      .get(`Candidate/${this.dateService.getDateFormat(this.value)}`)
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
