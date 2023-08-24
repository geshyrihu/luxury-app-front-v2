import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IFichaTecnicaActivoDto } from 'src/app/interfaces/IFichaTecnicaActivoDto.interface';
import { EInventoryCategoryPipe } from 'src/app/pipes/inventoryCategory.pipe';
import { EStatePipe } from 'src/app/pipes/state.pipe';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ficha-tecnica-activo',
  templateUrl: './ficha-tecnica-activo.component.html',
  standalone: true,
  imports: [NgbAlert, CommonModule, EStatePipe, EInventoryCategoryPipe],
  providers: [ToastService],
})
export default class FichaTecnicaActivoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public toastService = inject(ToastService);
  public swalService = inject(SwalService);

  urlImgBase: string = environment.base_urlImg;
  data: IFichaTecnicaActivoDto;
  id: number = 0;
  subRef$: Subscription;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<IFichaTecnicaActivoDto>(`Machineries/Fichatecnica/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
