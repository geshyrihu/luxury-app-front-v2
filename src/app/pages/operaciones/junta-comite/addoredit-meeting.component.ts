import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ETypeMeeting } from 'src/app/enums/tipo-reunion.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
  DateService,
} from 'src/app/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { IMeetingDto } from '../../../interfaces/IMeetingDto.interface';
import AddOrEditListAdministrationComponent from './addoredit-administration/addoredit-list-administration.component';
import AddOrEditComiteComponent from './addoredit-comite/addoredit-comite.component';
import AddOrEditInvitedComponent from './addoredit-invitado/addoredit-invited.component';

const date = new Date();
@Component({
  selector: 'app-addoredit-meeting',
  templateUrl: './addoredit-meeting.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AddOrEditComiteComponent,
    AddOrEditListAdministrationComponent,
    AddOrEditInvitedComponent,
    PrimeNgModule,
    ComponentsModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditMeetingComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

  subRef$: Subscription;

  dateNow = new Date(
    date.getTime() + new Date().getTimezoneOffset() * -60 * 1000
  )
    .toISOString()
    .slice(0, 19);
  id: any = 0;
  idNew: number;
  customerId: number;
  participantInvitado: any[] = [];
  cb_typeMeeting = onGetSelectItemFromEnum(ETypeMeeting);
  form: FormGroup;

  ngOnInit() {
    flatpickrFactory();
    this.customerId = this.config.data.customerId;

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      date: [this.dateNow, Validators.required],
      eTypeMeeting: ['', Validators.required],
      customerId: [this.customerId],
      user: [null],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    } else {
      const model: IMeetingDto = this.form.value;

      if (this.id !== 0) {
        this.customSwalService.onLoading();
        this.subRef$ = this.dataService
          .put(`Meetings/${this.id}`, model)
          .subscribe({
            next: () => {
              this.onLoadData();
              this.customSwalService.onClose();
            },
            error: (err) => {
              console.log(err.error);
              this.customToastService.onShowError();
              this.customSwalService.onClose();
            },
          });
      } else {
        this.customSwalService.onLoading();
        this.subRef$ = this.dataService.post(`Meetings`, model).subscribe({
          next: (resp: any) => {
            this.id = resp.body.id;
            this.onLoadData();
            this.customSwalService.onClose();
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            this.customSwalService.onClose();
          },
        });
      }
    }
  }

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Meetings/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
