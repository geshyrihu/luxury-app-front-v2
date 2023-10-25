// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { DropdownModule } from 'primeng/dropdown';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { ToastModule } from 'primeng/toast';
// import { Subscription } from 'rxjs';
// import { PresupuestoTomado } from 'src/app/interfaces/PresupuestoTomado';
// import { PipesModule } from 'src/app/pipes/pipes.module';
//
// import { DataService } from 'src/app/services/data.service';
// import { OrdenCompraService } from 'src/app/services/orden-compra.service';
// import { SelectItemService } from 'src/app/services/select-item.service';
// import { CustomSwalService } from 'src/app/services/swal.service';
// import { CustomToastService } from 'src/app/services/toast.service';
// import ComponentsModule from 'src/app/shared/components.module';
// import OrdenCompraDatosPagoComponent from '../../orden-compra-datos-pago/orden-compra-datos-pago.component';
// import OrdenCompraDenegadaComponent from '../../orden-compra-denegada/orden-compra-denegada.component';
// import OrdenCompraDetalleAddProductoComponent from '../../orden-compra-detalle-add-producto/orden-compra-detalle-add-producto.component';
// import OrdenCompraPresupuestoComponent from '../../orden-compra-presupuesto/orden-compra-presupuesto.component';
// import OrdenCompraStatusComponent from '../../orden-compra-status/orden-compra-status.component';
// import ModalOrdenCompraComponent from '../../orden-compra/modal-orden-compra.component';

// @Component({
//   selector: 'app-edit-orden-compra-fijos',
//   templateUrl: './edit-orden-compra-fijos.component.html',
//   standalone: true,
//   imports: [
//     FormsModule,
//     CommonModule,
//     PipesModule,
//     ComponentsModule,
//     ToastModule,
//     RouterModule,
//     DropdownModule,
//   ],
//   providers: [DialogService, MessageService, ConfirmationService, CustomToastService],
// })
// export default class EditOrdenCompraFijosComponent
//   implements OnInit, OnDestroy
// {
//
//   public customToastService = inject(CustomToastService);
//   public authService = inject(AuthService);
//   public dataService = inject(DataService);
//   public routeActive = inject(ActivatedRoute);
//   public router = inject(Router);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//   public ordenCompraService = inject(OrdenCompraService);
//   public selectItemService = inject(SelectItemService);

//   ref: DynamicDialogRef;
//   ordenCompraId: number = 0;
//   ordenCompra: any;
//   ordenCompraPresupuesto: any[] = [];
//   ordenCompraDetalle: any[] = [];
//   nombreAutorizador = '';

//   applicationUserId: string = '';

//   presupuestoTomado = new PresupuestoTomado();
//   ordenCompraEstaAutorizada: boolean = false;

//   solicitudCompraId: number = 0;
//   esNumeroNegativo = false;
//   totalRelacionadoConOtrasOrdenes: number = 0;
//   totalOrdenCompra = 0;
//   totalCubrir: number = 0;
//   iva: number = 0;
//   retencionIva: number = 0;
//   subtotal: number = 0;
//   cb_unidadMedida: any[] = [];
//   revisadaPorResidente: boolean = false;
//   icon: string = '';
//   esGastoFijo: boolean = false;

//   ngOnInit(): void {
//     this.ordenCompraId = this.routeActive.snapshot.params.id;
//     this.applicationUserId =
//       this.authService.userTokenDto.infoUserAuthDto.applicationUserId;

//     this.selectItemService
//       .onGetSelectItem('getMeasurementUnits')
//       .subscribe((resp) => {
//         this.cb_unidadMedida = resp;
//       });
//     this.onLoadData();
//   }

//   validarOrdenesCompraMismoFolioSolicituCompra() {
//     this.subRef$ = this.dataService
//       .get(
//         'OrdenCompra/ValidarOrdenesCompraMismoFolioSolicituCompra/' +
//           this.ordenCompraId
//       )
//       .subscribe((resp: any) => {
//         this.totalRelacionadoConOtrasOrdenes = resp.body;
//       });
//   }

//   onLoadData() {
//     this.esGastoFijo = false;

//     // Mostrar un mensaje de carga
this.customToastService.onLoading();
//     this.subRef$ = this.dataService
//       .get<any>(`OrdenCompra/${this.ordenCompraId}`)
//       .subscribe(
//         (resp: any) => {
//           this.ordenCompra = resp.body;

//           if (this.ordenCompra.ordenCompraDatosPago.tipoGasto === 0) {
//             this.esGastoFijo = true;
//           }
//           this.ordenCompraDetalle = this.ordenCompra.ordenCompraDetalle;
//           this.ordenCompraPresupuesto =
//             this.ordenCompra.ordenCompraPresupuestoUtilizado;
//           this.ordenCompraService.actualizarTotalOrdenCompra(
//             this.ordenCompraId
//           );
//           this.cargarTotalesOrdenCompra();

//           //... Obtener Id SolicitudCompra

//           if (this.ordenCompra.folioSolicitudCompra) {
//             this.subRef$ = this.dataService
//               .get(
//                 `SolicitudCompra/GetIdSolicitudCompra/${this.ordenCompra.folioSolicitudCompra}/${this.ordenCompra.customerId}`
//               )
//               .subscribe((resp: any) => {
//                 this.solicitudCompraId = resp.body;
//               });
//           }
//           //...Fin Obtener Id SolicitudCompra

//           //   Validando si ya fue revisada por el Residente
//           if (this.ordenCompra.ordenCompraAuth.revisadoPorResidente) {
//             this.revisadaPorResidente = true;
//           } else {
//             this.revisadaPorResidente = false;
//           }
//           //   Fin Validando si ya fue revisada por el Residente

//           if (this.ordenCompra.ordenCompraAuth.statusOrdenCompra === 0) {
//             this.ordenCompraEstaAutorizada = true;
//           }
//           if (
//             this.ordenCompra.ordenCompraAuth.statusOrdenCompra === 1 ||
//             this.ordenCompra.ordenCompraAuth.statusOrdenCompra === 2
//           ) {
//             this.ordenCompraEstaAutorizada = false;
//           }
//           if (this.ordenCompra.ordenCompraAuth.applicationUserAuthId !== null) {
//             this.nombreAutorizador = `${this.ordenCompra.ordenCompraAuth.applicationUserAuth.fullName} `;
//           }

//           if (this.ordenCompraService.getTotalPorCubrir() < 0) {
//             this.esNumeroNegativo = true;
//           }

//           // Buscar Ordenes de compra relacionadas
//           if (this.ordenCompra.folioSolicitudCompra) {
//             this.validarOrdenesCompraMismoFolioSolicituCompra();
//           }
//           // Fin Buscar Ordenes de compra relacionadas

//           this.customSwalService.onClose();
//         },
//         (err) => {
//           this.customToastService.onShowError();
//           this.customSwalService.onClose();
//           console.log(err.error);
//         }
//       );
//   }

//   autorizarCompra() {
//     this.subRef$ = this.dataService
//       .get(
//         `OrdenCompraAuth/Autorizar/${this.ordenCompraId}/${this.applicationUserId}`
//       )
//       .subscribe(
//         (resp: any) => {
//           this.onLoadData();
//         },
//         (err) => {
//           console.log(err.error);
//         }
//       );
//   }

//   deautorizarCompra() {
//     this.subRef$ = this.dataService
//       .get(
//         `OrdenCompraAuth/Desautorizar/${this.ordenCompraId}/${this.applicationUserId}`
//       )
//       .subscribe(
//         (resp: any) => {
//           this.nombreAutorizador = '';
//           this.onLoadData();
//         },
//         (err) => {
//           console.log(err.error);
//         }
//       );
//   }

//   //... Modales

//   onModalOrdenCompra() {
//     this.ref = this.dialogService.open(ModalOrdenCompraComponent, {
//       data: {
//         ordenCompra: this.ordenCompra,
//       },
//       header: 'Actualizar información',
//       styleClass: 'modal-md',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//     this.ref.onClose.subscribe((resp: any) => {
//       if (resp !== undefined) {
//         this.onLoadData();
//         this.customToastService.onShowSuccess();
//       }
//     });
//   }
//   onModalOrdenCompraDatosPago() {
//     this.ref = this.dialogService.open(OrdenCompraDatosPagoComponent, {
//       data: {
//         ordenCompra: this.ordenCompra,
//       },
//       header: 'Autorizar Datos de pago',
//       styleClass: 'modal-md',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }
//   onModalOrdenCompraStatus() {
//     this.ref = this.dialogService.open(OrdenCompraStatusComponent, {
//       data: {
//         ordenCompraId: this.ordenCompraId,
//       },
//       header: 'Autorizar Status de Orden de compra',
//       styleClass: 'modal-md',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }
//   onModalOrdenCompraPresupuesto() {
//     this.ref = this.dialogService.open(OrdenCompraPresupuestoComponent, {
//       data: {
//         ordenCompraId: this.ordenCompraId,
//       },
//       header: '',
//       width: '1400px',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }
//   onModalAgregarproducto() {
//     this.ref = this.dialogService.open(OrdenCompraDetalleAddProductoComponent, {
//       data: {
//         ordenCompraId: this.ordenCompraId,
//       },
//       header: 'Agregar ',
//       styleClass: 'modal-md',
//       width: 'auto',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }
//   onModalcompraNoAutorizada() {
//     this.ref = this.dialogService.open(OrdenCompraDenegadaComponent, {
//       data: {
//         ordenCompraId: this.ordenCompra.id,
//         ordenCompraAuthId: this.ordenCompra.ordenCompraAuth.id,
//       },
//       header: 'Denegar Orden de Compra',
//       styleClass: 'modal-md',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }
//   //... Fin Modales
//   onCuadroComparativo(idSolicitudCompra: number) {
//     this.router.navigateByUrl(`compras/cuadroComparativo/${idSolicitudCompra}`);
//   }
//   // ... Editar presupeusto del que se va a disponer
//   onEditOrdenCompraPresupuesto(item: any): void {
//     this.subRef$ = this.dataService
//       .put(`OrdenCompraPresupuesto/${item.id}`, item)
//       .subscribe(
//         (resp: any) => {
//           this.onLoadData();
//           this.customToastService.onShowSuccess();
//         },
//         (err) => {
//           console.log(err.error);
//         }
//       );
//   }
//   onDeleteOrdenCompraPresupuesto(id: number): void {
//     // Mostrar un mensaje de carga
this.customToastService.onLoading();
//     this.subRef$ = this.dataService
//       .delete(`OrdenCompraPresupuesto/${id}`)
//       .subscribe(
//         (resp: any) => {
//           this.customToastService.onShowSuccess();
//           this.onLoadData();
//           this.customSwalService.onClose();
//         },
//         (err) => {
//           this.customToastService.onShowError();
//           this.customSwalService.onClose();
//           console.log(err.error);
//         }
//       );
//   }

//   onDeleteProduct(data: any) {
//     // Mostrar un mensaje de carga
this.customToastService.onLoading();
//     this.subRef$ = this.dataService
//       .delete(`OrdenCompraDetalle/${data.id}`)
//       .subscribe(
//         (resp: any) => {
//           this.customToastService.onShowSuccess();
//           this.onLoadData();
//           this.customSwalService.onClose();
//         },
//         (err) => {
//           this.customToastService.onShowError();
//           this.customSwalService.onClose();
//           console.log(err.error);
//         }
//       );
//   }
//   onSubmitProducto(item: any): void {
//     this.subRef$ = this.dataService
//       .put(`OrdenCompraDetalle/${item.id}`, item)
//       .subscribe(
//         () => {
//           this.onLoadData();
//         },
//         (err) => {
//           console.log(err.error);
//         }
//       );
//   }
//   cargarTotalesOrdenCompra() {
//     let subTotal = 0;
//     let retencionIva = 0;
//     let ivaTotal = 0;
//     for (let n of this.ordenCompraDetalle) {
//       subTotal += n.subTotal;
//       if (n.unidadMedidaId === 14) {
//         retencionIva += n.subTotal;
//       }
//     }
//     for (let n of this.ordenCompraDetalle) {
//       ivaTotal += n.iva;
//     }

//     this.retencionIva = retencionIva * 0.06;
//     this.subtotal = subTotal;
//     this.iva = ivaTotal;
//     this.subtotal = subTotal;
//     this.totalOrdenCompra = this.subtotal + this.iva - this.retencionIva;
//   }
//   subRef$: Subscription;
//   ngOnDestroy() {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
