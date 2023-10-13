// import { Component, OnDestroy, OnInit, inject } from "@angular/core";
// import { RouterModule } from "@angular/router";
// import { MessageService } from "primeng/api";
// import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
// import { TableModule } from "primeng/table";
// import { ToastModule } from "primeng/toast";
// import { Subscription } from "rxjs";
// import { CustomerIdService } from "src/app/services/customer-id.service";
// import { DataService } from "src/app/services/data.service";
// import { CustomSwalService } from "src/app/services/swal.service";
// import { CustomToastService } from "src/app/services/toast.service";
// import ComponentsModule from "src/app/shared/components.module";
// import AddoreditPresupuestoEmpresaComponent from "./addoredit-presupuesto-empresa.component";

// @Component({
//   selector: "app-list-presupuesto-empresa",
//   templateUrl: "./list-presupuesto-empresa.component.html",
//   standalone: true,
//   imports: [ComponentsModule, TableModule, ToastModule, RouterModule],
//   providers: [DialogService, MessageService, CustomToastService],
// })
// export default class ListPresupuestoEmpresaComponent
//   implements OnInit, OnDestroy
// {
//   public customSwalService = inject(CustomSwalService);
//   private _toastService = inject(CustomToastService);
//   public dataService = inject(DataService);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//   public customerIdService = inject(CustomerIdService);
//   public get customToastService() {
//     return this._toastService;
//   }
//   public set customToastService(value) {
//     this._toastService = value;
//   }
//   data: any[] = [];
//   ref: DynamicDialogRef;
//   subRef$: Subscription;

//   ngOnInit(): void {
//     this.onLoadData();
//   }

//   onLoadData() {
//     this.customSwalService.onLoading();
//     this.subRef$ = this.dataService.get("PresupuestoEmpresa/GetAll").subscribe(
//       (resp: any) => {
//         this.data = resp.body;
//         this.customSwalService.onClose();
//       },
//       (err) => {
//         this.customToastService.onShowError();
//         console.log(err.error);
//         this.customSwalService.onClose();
//       }
//     );
//   }
//   onDelete(data: any) {
//     this.customSwalService.onLoading();
//     this.subRef$ = this.dataService
//       .delete(`PresupuestoEmpresa/${data.id}`)
//       .subscribe(
//         (resp: any) => {
//           this.customSwalService.onClose();
//           this.customToastService.onShowSuccess();
//           this.customSwalService.onClose();
//           this.onLoadData();
//         },
//         (err) => {
//           this.customToastService.onShowError();
//           this.customSwalService.onClose();
//           console.log(err.error);
//         }
//       );
//     this.customSwalService.onClose();
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
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
