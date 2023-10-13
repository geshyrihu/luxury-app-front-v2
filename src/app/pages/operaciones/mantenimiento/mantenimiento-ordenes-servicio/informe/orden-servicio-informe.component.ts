// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { MessageService } from 'primeng/api';
// import { Subscription } from 'rxjs';
// import { DataService } from 'src/app/services/data.service';
// import { DateService } from 'src/app/services/date.service';
// import { CustomSwalService } from 'src/app/services/swal.service';
// import { CustomToastService } from 'src/app/services/toast.service';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-orden-servicio-informe',
//   templateUrl: './orden-servicio-informe.component.html',
// standalone: true,
// imports: [CommonModule, ReactiveFormsModule, ComponentsModule],
//   providers: [MessageService, CustomToastService],
// })
// // TODO: VALIDAR SI ESTA PAGE SE USA
// export default class OrdenServicioInformeComponent implements OnInit, OnDestroy {
//   public dataService = inject(DataService);
//   public dateService = inject(DateService);
//   public customSwalService = inject(CustomSwalService);
//   public customToastService = inject(CustomToastService);
//   public messageService = inject(MessageService);
//   public rutaActiva = inject(ActivatedRoute);

//   data: any[] = [];
//   urlImg: string = '';
//   customerId: number = 0;
//   monthId: number = 0;
//   yearId: number = 0;
//   nameCarpetaFecha = '';

//   ngOnInit(): void {
//     this.customerId = this.rutaActiva.snapshot.params.customerId;
//     this.monthId = this.rutaActiva.snapshot.params.monthId;
//     this.yearId = this.rutaActiva.snapshot.params.yearId;
//     this.onLoadData();
//   }

//   onLoadData() {
//     this.customSwalService.onLoading();
//     this.subRef$ = this.dataService
//       .get(
//         `ServiceOrder/Informe/${this.customerId}/${this.monthId}/${this.yearId}`
//       )
//       .subscribe(
//         (resp: any) => {
//           this.data = resp.body;

//           if (this.data.length !== 0) {
//             this.nameCarpetaFecha = this.dateService.getDateFormat
//               this.data[0].requestDate
//             );
//             this.urlImg = `${environment.base_urlImg}customers/${this.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
//           }

//           this.customSwalService.onClose();
//         },
//         (err) => {
//           this.customToastService.onShowError();
//           console.log(err.error);
//           this.customSwalService.onClose();
//         }
//       );
//   }
//   subRef$: Subscription;
//   ngOnDestroy() {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
