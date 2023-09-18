import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ETurnoTrabajoPipe } from 'src/app/pipes/turno-trabajo.pipe';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-hours-work-position',
  templateUrl: './hours-work-position.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, ETurnoTrabajoPipe],
  providers: [ToastService],
})
export default class HoursWorkPositionComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  data: any;
  subRef$: Subscription;
  ngOnInit() {
    this.onLoadData(this.config.data.workPositionId);
  }

  onLoadData(workPositionId: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService

      .get(`WorkPosition/GetHours/${workPositionId}`)
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
