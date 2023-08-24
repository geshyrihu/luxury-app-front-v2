// import { Component, OnDestroy, OnInit, inject } from "@angular/core";
// import { RouterModule } from "@angular/router";
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
// import AddoreditPresupuestoEmpresaComponent from "./addoredit-presupuesto-empresa.component";

// @Component({
//   selector: "app-index-presupuesto-empresa",
//   templateUrl: "./index-presupuesto-empresa.component.html",
//   standalone: true,
//   imports: [ComponentsModule, TableModule, ToastModule, RouterModule],
//   providers: [DialogService, MessageService, ToastService],
// })
// export default class IndexPresupuestoEmpresaComponent
//   implements OnInit, OnDestroy
// {
//   public swalService = inject(SwalService);
//   private _toastService = inject(ToastService);
//   public dataService = inject(DataService);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//   public customerIdService = inject(CustomerIdService);
//   public get toastService() {
//     return this._toastService;
//   }
//   public set toastService(value) {
//     this._toastService = value;
//   }
//   data: any[] = [];
//   ref: DynamicDialogRef;
//   subRef$: Subscription;

//   ngOnInit(): void {
//     this.onLoadData();
//   }

//   onLoadData() {
//     this.swalService.onLoading();
//     this.subRef$ = this.dataService.get("PresupuestoEmpresa/GetAll").subscribe(
//       (resp: any) => {
//         this.data = resp.body;
//         this.swalService.onClose();
//       },
//       (err) => {
//         this.toastService.onShowError();
//         console.log(err.error);
//         this.swalService.onClose();
//       }
//     );
//   }
//   onDelete(data: any) {
//     this.swalService.onLoading();
//     this.subRef$ = this.dataService
//       .delete(`PresupuestoEmpresa/${data.id}`)
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

//   onModalAddOrEditPresupuestoEmpresa(data: any) {
//     this.ref = this.dialogService.open(AddoreditPresupuestoEmpresaComponent, {
//       data: {
//         id: data.id,
//       },
//       header: data.title,
//       styleClass: "modal-md",
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
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
