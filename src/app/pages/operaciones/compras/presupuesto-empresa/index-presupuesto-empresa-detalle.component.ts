// import { CommonModule } from "@angular/common";
// import { Component, OnDestroy, OnInit, inject } from "@angular/core";
// import { ActivatedRoute } from "@angular/router";
// import { MessageService } from "primeng/api";
// import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
// import { TableModule } from "primeng/table";
// import { ToastModule } from "primeng/toast";
// import { Subscription } from "rxjs";
// import { CustomerIdService } from "src/app/services/customer-id.service";
// import { DataService } from "src/app/services/data.service";
// import { SwalService } from "src/app/services/swal.service";
// import { ToastService } from "src/app/services/toast.service";
// import ComponentsModule from "src/app/shared/components.module";
// import AddOrEditPresupuestoEmpresaDetalleComponent from "./add-or-edit-presupuesto-empresa-detalle.component";

// @Component({
//   selector: "app-index-presupuesto-empresa-detalle",
//   templateUrl: "./index-presupuesto-empresa-detalle.component.html",
//   standalone: true,
//   imports: [ComponentsModule, CommonModule, TableModule, ToastModule],
//   providers: [DialogService, MessageService, ToastService],
// })
// export default class IndexPresupuestoEmpresaDetalleComponent
//   implements OnInit, OnDestroy
// {
//   public swalService = inject(SwalService);
//   public toastService = inject(ToastService);
//   public dataService = inject(DataService);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//   public customerIdService = inject(CustomerIdService);
//   public rutaActiva = inject(ActivatedRoute);
//   presupuestoEmpresaId: number = 0;
//   presupuesto: string = "";
//   totales: any;
//   data: any[] = [];
//   ref: DynamicDialogRef;
//   subRef$: Subscription;

//   ngOnInit(): void {
//     this.presupuestoEmpresaId = this.rutaActiva.snapshot.params.id;
//     this.onLoadData();
//   }

//   onLoadData() {
//     this.swalService.onLoading();
//     this.subRef$ = this.dataService
//       .get("PresupuestoEmpresaDetalle/GetAll/" + this.presupuestoEmpresaId)
//       .subscribe(
//         (resp: any) => {
//           this.presupuesto = resp.body.presupuesto;
//           this.data = resp.body.items;
//           this.totales = resp.body.totales;

//           this.swalService.onClose();
//         },
//         (err) => {
//           this.toastService.onShowError();
//           console.log(err.error);
//           this.swalService.onClose();
//         }
//       );
//   }
//   onDelete(data: any) {
//     this.swalService.onLoading();
//     this.subRef$ = this.dataService
//       .delete(`PresupuestoEmpresaDetalle/${data.id}`)
//       .subscribe(
//         (resp: any) => {
//           this.swalService.onClose();
//           this.toastService.onShowSuccess();
//           this.swalService.onClose();
//           this.onLoadData();
//         },
//         (err) => {
//           this.toastService.onShowError();
//           this.swalService.onClose();
//           console.log(err.error);
//         }
//       );
//     this.swalService.onClose();
//   }

//   onModalAddOrEditPresupuestoEmpresaDetalle(data: any) {
//     this.ref = this.dialogService.open(
//       AddOrEditPresupuestoEmpresaDetalleComponent,
//       {
//         data: {
//           id: data.id,
//           presupuestoEmpresaId: this.presupuestoEmpresaId,
//         },
//         header: data.title,
//         styleClass: "modal-md",
//         closeOnEscape: true,
//         baseZIndex: 10000,
//       }
//     );
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.toastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
