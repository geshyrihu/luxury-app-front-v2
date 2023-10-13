import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EExtintor } from 'src/app/enums/extintor.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { IInventarioExtintorDto } from 'src/app/interfaces/IInventarioExtintorDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-inventario-extintor',
  templateUrl: './addoredit-inventario-extintor.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditInventarioExtintorComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public authService = inject(AuthService);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;
  cb_extintor: ISelectItemDto[] = onGetSelectItemFromEnum(EExtintor);
  urlBaseImg = `${environment.base_urlImg}customers/`;
  photoFileUpdate: boolean = false;
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getcustomerId(), Validators.required],
    eExtintor: ['', Validators.required],
    ubicacion: ['', Validators.required],
    photo: [''],
    employeeId: [],
  });

  uploadFile(file: any) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photo: file });
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get<IInventarioExtintorDto>(`InventarioExtintor/${this.id}`)
      .subscribe((resp: any) => {
        this.urlBaseImg = `${environment.base_urlImg}/customers/${resp.body.customerId}/extintor/${resp.body.photo}`;
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    this.form.patchValue({
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.customSwalService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`InventarioExtintor`, formData)
        .subscribe({
          next: () => {
            this.customSwalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customSwalService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`InventarioExtintor/${this.id}`, formData)
        .subscribe({
          next: () => {
            this.customSwalService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customSwalService.onClose();
          },
        });
    }
  }
  private createFormData(dto: any): FormData {
    const formData = new FormData();
    formData.append('customerId', String(dto.customerId));
    formData.append('eExtintor', String(dto.eExtintor));
    formData.append('ubicacion', String(dto.ubicacion));
    formData.append(
      'employeeId',
      String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
    );
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.photo) {
      formData.append('photo', dto.photo);
    }
    return formData;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
