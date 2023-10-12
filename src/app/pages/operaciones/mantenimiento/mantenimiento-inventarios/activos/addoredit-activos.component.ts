import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { Subscription } from 'rxjs';
import { EInventoryCategory } from 'src/app/enums/categoria-inventario.enum';
import { EState } from 'src/app/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-activos',
  templateUrl: './addoredit-activos.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    EditorModule,
    CustomInputModule,
  ],
  providers: [DialogService, ToastService],
})
export default class AddOrEditActivosComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public getdateService = inject(DateService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  urlBaseImg = '';
  public id: number = 0;
  user = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  customerId: number = this.customerIdService.getcustomerId();
  cb_inventoryCategory: ISelectItemDto[] =
    onGetSelectItemFromEnum(EInventoryCategory);
  machineryDTO: any;
  photoFileUpdate: boolean = false;
  category: any;
  cb_equipoClasificacion: ISelectItemDto[] = [];

  form: FormGroup;

  optionActive: any[] = onGetSelectItemFromEnum(EState);
  ngOnInit(): void {
    this.onLoadEquipoClasificacion();
    this.urlBaseImg = `${
      environment.base_urlImg
    }customers/${this.customerIdService.getcustomerId()}/machinery/`;
    this.category = this.config.data.inventoryCategory;

    if (this.config.data.id !== 0) this.onLoadData(this.config.data.id);

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      brand: [''],
      customerId: [this.customerId],
      dateOfPurchase: ['', [Validators.required]],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
      equipoClasificacionId: ['', Validators.required],
      inventoryCategory: [this.category, [Validators.required]],
      model: [''],
      nameMachinery: ['', [Validators.required, Validators.minLength(5)]],
      observations: [''],
      photoPath: [''],
      serie: [''],
      state: [EState[Object.keys(EState)[0]], [Validators.required]],
      technicalSpecifications: [''],
      ubication: ['', [Validators.required]],
    });
  }
  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
  onLoadData(id: number) {
    this.subRef$ = this.dataService
      .get(`Machineries/${id}`)
      .subscribe((resp: any) => {
        this.id = resp.body.id;
        resp.body.dateOfPurchase = this.getdateService.getDateFormat(
          resp.body.dateOfPurchase
        );
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    const model = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService.post('Machineries', model).subscribe({
        next: () => {
          this.ref.close(true);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });
    } else {
      this.subRef$ = this.dataService
        .put(`Machineries/${this.id}`, model)
        .subscribe({
          next: () => {
            this.swalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.toastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.swalService.onClose();
          },
        });
    }
  }

  private createFormData(machineryDTO: any): FormData {
    let formData = new FormData();
    formData.append('employeeId', machineryDTO.employeeId);
    formData.append('nameMachinery', machineryDTO.nameMachinery);
    formData.append('ubication', machineryDTO.ubication);
    formData.append('brand', machineryDTO.brand);
    formData.append('serie', machineryDTO.serie);
    formData.append('model', machineryDTO.model);
    formData.append('state', String(machineryDTO.state));
    formData.append(
      'dateOfPurchase',
      this.dateService.getDateFormat(machineryDTO.dateOfPurchase)
    );
    formData.append('customerId', String(this.customerId));
    formData.append(
      'equipoClasificacionId',
      String(machineryDTO.equipoClasificacionId)
    );
    formData.append(
      'inventoryCategory',
      String(machineryDTO.inventoryCategory)
    );
    formData.append(
      'technicalSpecifications',
      machineryDTO.technicalSpecifications
    );
    formData.append('observations', machineryDTO.observations);
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (machineryDTO.photoPath) {
      formData.append('photoPath', machineryDTO.photoPath);
    }
    return formData;
  }

  onLoadEquipoClasificacion() {
    this.subRef$ = this.dataService
      .get('EquipoClasificacion/SelectItem')
      .subscribe({
        next: (resp: any) => {
          this.cb_equipoClasificacion = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  get f() {
    return this.form.controls;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
