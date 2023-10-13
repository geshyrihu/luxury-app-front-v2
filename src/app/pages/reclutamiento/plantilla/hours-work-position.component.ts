import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ETurnoTrabajoPipe } from 'src/app/pipes/turno-trabajo.pipe';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';

@Component({
  selector: 'app-hours-work-position',
  templateUrl: './hours-work-position.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, ETurnoTrabajoPipe],
  providers: [CustomToastService],
})
export default class HoursWorkPositionComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  data: any;
  subRef$: Subscription;
  ngOnInit() {
    this.onLoadData(this.config.data.workPositionId);
  }

  onLoadData(workPositionId: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService

      .get(`WorkPosition/GetHours/${workPositionId}`)
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
