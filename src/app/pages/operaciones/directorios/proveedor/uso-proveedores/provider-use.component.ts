import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-provider-use',
  templateUrl: './provider-use.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [CustomToastService],
})
export default class ProviderUseComponent implements OnInit, OnDestroy {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  data: any[] = [];
  providerId: number = 0;

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData(this.providerId);
  }

  onLoadData(providerId: number) {
    this.subRef$ = this.dataService
      .get(`Providers/Coincidencias/${providerId}`)
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
