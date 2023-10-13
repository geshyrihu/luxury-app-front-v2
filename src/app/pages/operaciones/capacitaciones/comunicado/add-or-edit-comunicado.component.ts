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
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-comunicado',
  templateUrl: './add-or-edit-comunicado.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditComunicadoComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  id: number = 0;

  errorMessage: string = '';
  file: any = null;
  subRef$: Subscription;
  cb_area_responsable: ISelectItemDto[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    nombreComunicado: ['', Validators.required],
    folioComunicado: ['', Validators.required],
    fechaPublicacion: ['', Validators.required],
    responsibleAreaId: ['', Validators.required],
    responsibleArea: ['', Validators.required],
    comunicadoPath: [''],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form.patchValue({ area: this.config.data.titulo });
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.get(`Comunicado/${this.id}`).subscribe({
      next: (resp: any) => {
        this.form.patchValue(resp.body);
        this.customSwalService.onClose();
      },
      error: (err) => {
        this.customSwalService.onClose();
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }

  public saveAreResponsableId(e: any): void {
    let find = this.cb_area_responsable.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      responsibleAreaId: find?.value,
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    const model = this.onCreateFormData(this.form.value);
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.customSwalService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService.post(`Comunicado`, model).subscribe({
        next: () => {
          this.ref.close(true);
          this.customSwalService.onClose();
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
        .put(`Comunicado/${this.id}`, model)
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
  uploadFile(event) {
    this.file = event.target.files[0];
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('nombreComunicado', String(dto.nombreComunicado));
    formData.append('folioComunicado', dto.folioComunicado);
    formData.append(
      'fechaPublicacion',
      this.dateService.getDateFormat(dto.fechaPublicacion)
    );
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (this.file != null) {
      formData.append('comunicadoPath', this.file);
    }
    return formData;
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('ResponsibleArea')
      .subscribe((resp) => {
        this.cb_area_responsable = resp;
      });
  }
}
