import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import { ViewPdfService } from 'src/app/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import CrudEntregaRecepcionClienteComponent from '../crud-entrega-recepcion-cliente/crud-entrega-recepcion-cliente.component';

@Component({
  selector: 'app-entrega-recepcion-cliente',
  templateUrl: './entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, TableModule, ToastModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class EntregaRecepcionClienteComponent
  implements OnInit, OnDestroy
{
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public viewPdfService = inject(ViewPdfService);
  public swalService = inject(SwalService);
  public route = inject(Router);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  cb_departamento = [
    { value: 'JURIDICO' },
    { value: 'ADMINISTRACIÓN Y FINANZAS' },
    { value: 'OPERACIONES Y MANTENIMIENTO' },
  ];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  departamento = this.cb_departamento[0].value;

  onValidarCargo() {
    if (this.authService.onValidateRoles(['Contador']))
      this.departamento = this.cb_departamento[1].value;
    if (this.authService.onValidateRoles(['Legal']))
      this.departamento = this.cb_departamento[0].value;
    if (this.authService.onValidateRoles(['Operaciones']))
      this.departamento = this.cb_departamento[2].value;
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onValidarCargo();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onChangeDepartamento(departamento: string) {
    this.departamento = departamento;
    this.onLoadData();
  }
  onLoadData() {
    this.swalService.onLoading();
    // * Peticion para generar los items de entrega recepcion
    this.subRef$ = this.dataService
      .get('EntregaRecepcionCliente/GenerateData')
      .subscribe({
        next: (resp: any) => {},
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
    // * Peticion para generar los items de entrega recepcion
    this.subRef$ = this.dataService
      .get(
        'EntregaRecepcionCliente/' +
          this.customerIdService.customerId +
          '/' +
          this.departamento
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(CrudEntregaRecepcionClienteComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  navigateToPdf(url: string) {
    const urlFinal =
      'customers/' +
      this.customerIdService.getcustomerId() +
      '/entregarecepcion/' +
      url;
    this.viewPdfService.setNameDocument(urlFinal);
    this.route.navigate(['documento/view-documento']);
  }

  onValidarDocument(id: number) {
    this.subRef$ = this.dataService
      .put(
        `EntregaRecepcionCliente/ValidarArchivo/${this.authService.userTokenDto.infoEmployeeDto.employeeId}/${id}`,
        null
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onInvalidarDocument(id: number) {
    this.subRef$ = this.dataService
      .put(`EntregaRecepcionCliente/InvalidarArchivo/${id}`, null)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onDeleteFile(id: number) {
    this.subRef$ = this.dataService
      .delete(`EntregaRecepcionCliente/DeleteFile/${id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
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
