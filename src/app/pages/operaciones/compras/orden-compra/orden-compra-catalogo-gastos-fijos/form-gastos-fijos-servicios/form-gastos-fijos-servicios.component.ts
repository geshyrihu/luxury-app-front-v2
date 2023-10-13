import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CatalogoGastosFijosService,
  CustomSwalService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-gastos-fijos-servicios',
  templateUrl: './form-gastos-fijos-servicios.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, PrimeNgModule],
  providers: [MessageService, CustomToastService],
})
export default class FormGastosFijosServiciosComponent
  implements OnInit, OnDestroy
{
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);

  catalogoGastosFijosId: number = 0;
  productos: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  mensajeError = false;
  catalogoGastosFijosDetalles: any;
  id: any;
  cb_unidadMedida: any[] = [];
  productosAgregados: any[] = [];
  subRef$: Subscription;

  ngOnInit(): void {
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_unidadMedida = resp;
      });

    this.catalogoGastosFijosId =
      this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    this.onLoadProducts();
    this.onLoadProductsAgregados();
  }
  onLoadProductsAgregados() {
    this.subRef$ = this.dataService
      .get(
        `CatalogoGastosFijosDetalles/DetallesOrdenCompraFijos/${this.catalogoGastosFijosId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.productosAgregados = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  deleteProductoAgregado(id: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CatalogoGastosFijosDetalles/${id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadProductsAgregados();
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  onLoadProducts() {
    this.subRef$ = this.dataService
      .get(
        'CatalogoGastosFijosDetalles/GetALLCatalogoGastosFijosProductoDto/' +
          this.catalogoGastosFijosId
      )
      .subscribe({
        next: (resp: any) => {
          this.productos = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit(item: any) {
    if (item.unidadMedidaId === 0 || item.cantidad === 0) {
      this.mensajeError = true;
      return;
    }

    item.catalogoGastosFijosId = this.catalogoGastosFijosId;
    this.subRef$ = this.dataService
      .post<any>(`CatalogoGastosFijosDetalles/`, item)
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.mensajeError = false;
          this.onLoadProducts();
          this.onLoadProductsAgregados();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onUpdateProductoAgregado(item: any) {
    this.subRef$ = this.dataService
      .put(`CatalogoGastosFijosDetalles/${item.id}`, item)
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.mensajeError = false;
          this.onLoadProducts();
          this.onLoadProductsAgregados();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
