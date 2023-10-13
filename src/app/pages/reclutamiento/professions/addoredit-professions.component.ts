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
import { IProfessionAddOrEditDto } from 'src/app/interfaces/IProfessionAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-professions',
  templateUrl: './addoredit-professions.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditProfessionsComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public selectItemService = inject(SelectItemService);
  public ref = inject(DynamicDialogRef);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;

  cb_area_responsable: ISelectItemDto[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    nameProfession: ['', [Validators.required, Validators.minLength(5)]],
    ecompanyDepartments: ['', [Validators.required]],
    description: ['', [Validators.required]],
    hierarchy: ['', [Validators.required]],
    requirements: ['', [Validators.required]],
    responsibilities: ['', [Validators.required]],
    professionkey: ['', [Validators.required]],
  });

  onLoadSelectItem() {
    this.cb_area_responsable = [
      { value: 0, label: 'Administrativa' },
      { value: 1, label: 'Legal' },
      { value: 2, label: 'Operaciones' },
      { value: 3, label: 'Mantenimiento' },
      { value: 4, label: 'Servicio' },
    ];
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  onLoadData(id: number) {
    this.subRef$ = this.dataService
      .get<IProfessionAddOrEditDto>(`Professions/${id}`)
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

    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.customSwalService.onLoading();

    if (this.id === 0) {
      // ...Creación de registro
      this.subRef$ = this.dataService
        .post(`Professions`, this.form.value)
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
      // ...Actualización de registro
      this.subRef$ = this.dataService
        .put(`Professions/${this.id}`, this.form.value)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
