import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { EStatus } from 'src/app/enums/estatus.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { SelectItemService } from 'src/app/services/select-item.service';

@Component({
  selector: 'app-ticketv2-filter',
  templateUrl: './ticketv2-filter.component.html',
  standalone: true,
  imports: [CommonModule, NgSelectModule],
})
export class Ticketv2FilterComponent implements OnInit {
  public selectItemService = inject(SelectItemService);

  cb_departamento: ISelectItemDto[] = [];
  cb_status: ISelectItemDto[] = onGetSelectItemFromEnum(EStatus);
  multidepartamento: number = 1;
  ngOnInit() {
    this.ngOnLoadSelectItem();
  }

  ngOnLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('ResponsibleArea')
      .subscribe((resp) => {
        this.cb_departamento = resp;
      });
  }
}
