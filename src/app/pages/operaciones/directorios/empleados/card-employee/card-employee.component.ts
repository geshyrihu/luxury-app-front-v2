import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IUserCardDto } from 'src/app/interfaces/IUserCardDto.interface';
import PhoneFormatPipe from 'src/app/pipes/phone-format.pipe';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-employee',
  templateUrl: './card-employee.component.html',
  standalone: true,
  imports: [CommonModule, PhoneFormatPipe],
  providers: [ToastService],
})
export default class CardEmployeeComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public toastService = inject(ToastService);

  subRef$: Subscription;
  urlImage: string = '';
  employeeId: number = 0;
  // employeeId: number = 0;
  user: IUserCardDto;

  ngOnInit(): void {
    this.employeeId = this.config.data.employeeId;
    // this.employeeId = this.config.data.employeeId;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get<IUserCardDto>(`Auth/CardUser/${this.employeeId}`)
      .subscribe({
        next: (resp: any) => {
          this.user = resp.body;
          this.urlImage = `${environment.base_urlImg}Administration/accounts/${this.user.photoPath}`;
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
