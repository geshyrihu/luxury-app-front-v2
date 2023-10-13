import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [CustomToastService],
})
export default class ListRolesComponent implements OnInit, OnDestroy {
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.get('Roles').subscribe({
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

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
