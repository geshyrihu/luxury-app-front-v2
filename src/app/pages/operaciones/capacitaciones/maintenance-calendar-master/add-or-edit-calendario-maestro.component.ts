import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EMonths2 } from 'src/app/enums/meses.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-calendario-maestro',
  templateUrl: './add-or-edit-calendario-maestro.component.html',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditCalendarioMaestroComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);
  private;

  subRef$: Subscription;

  proveedoresSeleccionados: ISelectItemDto[] = [];
  cb_equipoCalendarioMaestro: ISelectItemDto[] = [];
  cb_providers: ISelectItemDto[] = [];
  cb_meses: ISelectItemDto[] = onGetSelectItemFromEnum(EMonths2);

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    calendarioMaestroEquipoId: [0, Validators.required],
    descripcionServicio: ['', Validators.required],
    mes: [Validators.required],
    observaciones: [''],
    proveedores: [[]],
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    this.form.patchValue({
      mes: this.config.data.mes,
    });
    if (this.id !== 0) this.onLoadData(this.id);
  }

  get f() {
    return this.form.controls;
  }
  onLoadData(id: number) {
    this.subRef$ = this.dataService
      .get(`CalendarioMaestro/${id}`)
      .subscribe((resp: any) => {
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

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.customSwalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post('CalendarioMaestro', this.form.value)
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
        .put(`CalendarioMaestro/${this.id}`, this.form.value)
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

  onLoadSelectItem() {
    this.subRef$ = this.selectItemService
      .onGetSelectItem('EquipoCalendarioMaestro')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_equipoCalendarioMaestro = items;
      });
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
