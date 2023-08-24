// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { MessageService } from 'primeng/api';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { TableModule } from 'primeng/table';
// import { ToastModule } from 'primeng/toast';
// import { Subscription } from 'rxjs';
// import { AuthService } from 'src/app/services/auth.service';
// import { DataService } from 'src/app/services/data.service';
// import { SwalService } from 'src/app/services/swal.service';
// import { ToastService } from 'src/app/services/toast.service';
// import ComponentsModule from 'src/app/shared/components.module';
// import AddOrEditCuentaComponent from './addoredit-cuenta.component';
// import AddOrEditSubCuentaComponent from './addoredit-subCuenta.component';

// @Component({
//   selector: 'app-index-cuentas',
//   templateUrl: './index-cuentas.component.html',
//   standalone: true,
//   imports: [ComponentsModule, CommonModule, TableModule, ToastModule],
//   providers: [DialogService, MessageService, ToastService],
// })
// export default class IndexCuentasComponent implements OnInit, OnDestroy {
//   public swalService = inject(SwalService);
//   public toastService = inject(ToastService);
//   public authService = inject(AuthService);
//   public dataService = inject(DataService);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//   data: any[] = [];

//   ref: DynamicDialogRef;
//   subRef$: Subscription;

//   ngOnInit(): void {
//     this.onLoadData();
//   }

//   onLoadData() {
//     this.swalService.onLoading();
//     this.subRef$ = this.dataService.get('CompraCuenta').subscribe(
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
//     this.subRef$ = this.dataService.delete(`CompraCuenta/${data.id}`).subscribe(
//       (resp: any) => {
//         this.swalService.onClose();
//         this.toastService.onShowSuccess();
//         this.swalService.onClose();
//         this.onLoadData();
//       },
//       (err) => {
//         this.toastService.onShowError();
//         this.swalService.onClose();
//         console.log(err.error);
//       }
//     );
//     this.swalService.onClose();
//   }
//   onDeleteSubCuenta(data: any) {
//     this.swalService.onLoading();
//     this.subRef$ = this.dataService
//       .delete(`CompraSubCuenta/${data.id}`)
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

//   onModalAddOrEditCuenta(data: any) {
//     this.ref = this.dialogService.open(AddOrEditCuentaComponent, {
//       data: {
//         id: data.id,
//       },
//       header: data.title,
//       styleClass: 'modal-md',
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

//   onModalAddOrEditSubCuenta(data: any) {
//     this.ref = this.dialogService.open(AddOrEditSubCuentaComponent, {
//       data: {
//         id: data.id,
//         compraCuentaId: data.compraCuentaId,
//       },
//       header: data.title,
//       styleClass: 'modal-md',
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
