import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AutosizeDirective } from 'src/app/directives/autosize-text-area.diective';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-descripcion-puesto',
  templateUrl: './descripcion-puesto.component.html',
  standalone: true,
  imports: [CommonModule, AutosizeDirective],
  providers: [ToastService],
})
export default class DescripcionPuestoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public toastService = inject(ToastService);
  profesion: any;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get('Professions/' + this.config.data.id)
      .subscribe({
        next: (resp: any) => {
          this.profesion = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
