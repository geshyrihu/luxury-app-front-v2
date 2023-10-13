import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-status',
  templateUrl: './orden-compra-status.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    ToastModule,
    CustomInputModule,
  ],
})
export default class OrdenCompraStatusComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  submitting: boolean = false;
  subRef$: Subscription;

  ordenCompraId: number = 0;
  ordenCompraStatus: any;
  form: FormGroup = this.formBuilder.group({
    id: [0],
    ordenCompraId: [0],
    sePago: [false],
    seRecibio: [false],
    recibidoPor: [''],
    factura: [''],
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`OrdenCompraStatus/${this.ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.ordenCompraStatus = resp.body;
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onSubmit() {
    this.customSwalService.onLoading();
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.subRef$ = this.dataService
      .put(`OrdenCompraStatus/${this.ordenCompraStatus.id}`, this.form.value)
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customSwalService.onClose();
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
