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
import { ECargoComite } from 'src/app/enums/cargo-comite.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { IComiteVigilanciaAddOrEditDto } from 'src/app/interfaces/IComiteVigilanciaAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
@Component({
  selector: 'app-addoredit-comite-vigilancia',
  templateUrl: './addoredit-comite-vigilancia.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditComiteVigilanciaComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  public customerIdService = inject(CustomerIdService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  cb_position: ISelectItemDto[] = onGetSelectItemFromEnum(ECargoComite);
  cb_condomino: ISelectItemDto[] = [];
  id: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    listCondominoId: ['', Validators.required],
    nameDirectoryCondominium: ['', Validators.required],
    ePosicionComite: ['', [Validators.required]],
    customerId: [],
  });
  subRef$: Subscription;

  //

  ngOnInit(): void {
    this.subRef$ = this.selectItemService
      .onGetSelectItem(
        `ListCondomino/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp) => {
        this.cb_condomino = resp;
      });

    this.form.patchValue({
      customerId: this.customerIdService.getcustomerId(),
    });

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  public saveCondominoId(e): void {
    let find = this.cb_condomino.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      listCondominoId: find?.value,
    });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get<IComiteVigilanciaAddOrEditDto>(`ComiteVigilancia/${this.id}`)
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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`ComiteVigilancia`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`ComiteVigilancia/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
