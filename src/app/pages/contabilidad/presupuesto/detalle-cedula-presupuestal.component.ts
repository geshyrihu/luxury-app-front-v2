// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { MessageService } from 'primeng/api';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { TableModule } from 'primeng/table';
// import { ToastModule } from 'primeng/toast';
// import { Subscription } from 'rxjs';
//
// import { DataService } from 'src/app/services/data.service';
// import { CustomSwalService } from 'src/app/services/swal.service';
// import { CustomToastService } from 'src/app/services/toast.service';
// import ComponentsModule from 'src/app/shared/components.module';
// import AddPartidaCedulaComponent from './add-partida-cedula.component';
// import EditPartidaCedulaComponent from './edit-partida-cedula.component';

// @Component({
//   selector: 'app-detalle-cedula-presupuestal',
//   templateUrl: './detalle-cedula-presupuestal.component.html',
//   standalone: true,
//   imports: [ComponentsModule, CommonModule],
//   providers: [DialogService, MessageService, CustomToastService],
// })

// // TODO: REVISAR SI COMPONENTE AUN SE USA
// export default class DetalleCedulaPresupuestalComponent
//   implements OnInit, OnDestroy
// {
//   private pathActive = inject(ActivatedRoute);
//   public customToastService = inject(CustomToastService);
//   private dataService = inject(DataService);
//   public authService = inject(AuthService);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//

//   constructor() {
//     this.idBudgetCard = this.pathActive.snapshot.params.id;
//   }

//   submitting: boolean = false;
//   data: any[] = [];
//   idBudgetCard: number = 0;
//   ref: DynamicDialogRef;
//   subRef$: Subscription;

//   ngOnInit() {
//     this.onLoadData();
//   }

//   onLoadData() {
//     // Mostrar un mensaje de carga
this.customToastService.onLoading();
//     this.subRef$ = this.dataService
//       .get(`CedulaPresupuestalDetalles/GetAllAsync/${this.idBudgetCard}`)
//       .subscribe({
//         next: (resp: any) => {
//           this.data = resp.body;
//           this.customSwalService.onClose();
//         },
//         error: (err) => {
//           console.log(err.error);
//           this.customSwalService.onClose();
//           this.customToastService.onShowError();
//         },
//       });
//   }
//   onModalAdd() {
//     this.ref = this.dialogService.open(AddPartidaCedulaComponent, {
//       data: {
//         idBudgetCard: this.idBudgetCard,
//       },
//       header: 'Agregar Partida',
//       height: 'auto',
//       width: '80%',
//       styleClass: 'modal-md',
//       baseZIndex: 10000,
//       closeOnEscape: true,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }

//   onModalEditar(data: any) {
//     this.ref = this.dialogService.open(EditPartidaCedulaComponent, {
//       data: {
//         id: data.id,
//         idBudgetCard: this.idBudgetCard,
//       },
//       header: data.title,
//       height: 'auto',
//       styleClass: 'modal-md',
//       baseZIndex: 10000,
//       closeOnEscape: true,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       if (resp) {
//         this.customToastService.onShowSuccess();
//         this.onLoadData();
//       }
//     });
//   }

//   onDelete(data: any) {
//     this.subRef$ = this.dataService
//       .delete(`CedulaPresupuestalDetalles/${data.id}`)
//       .subscribe({
//         next: () => {
//           this.customToastService.onShowSuccess();
//           this.onLoadData();
//         },
//         error: (err) => {
//           this.customToastService.onShowError();
//           console.log(err.error);
//         },
//       });
//   }
//   ngOnDestroy() {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
