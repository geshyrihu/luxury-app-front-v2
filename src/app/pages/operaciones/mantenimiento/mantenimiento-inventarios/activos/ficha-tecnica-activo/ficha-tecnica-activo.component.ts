import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IFichaTecnicaActivoDto } from 'src/app/interfaces/IFichaTecnicaActivoDto.interface';
import { EInventoryCategoryPipe } from 'src/app/pipes/inventoryCategory.pipe';
import { EStatePipe } from 'src/app/pipes/state.pipe';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ficha-tecnica-activo',
  templateUrl: './ficha-tecnica-activo.component.html',
  standalone: true,
  imports: [NgbAlert, CommonModule, EStatePipe, EInventoryCategoryPipe],
  providers: [CustomToastService],
})
export default class FichaTecnicaActivoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

  urlImgBase: string = environment.base_urlImg;
  data: IFichaTecnicaActivoDto;
  id: number = 0;
  subRef$: Subscription;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<IFichaTecnicaActivoDto>(`Machineries/Fichatecnica/${this.id}`)
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
