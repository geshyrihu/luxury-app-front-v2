import { Component, OnDestroy, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import CustomButtonComponent from 'src/app/shared/custom-buttons/custom-button/custom-button.component';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonComponent],
  standalone: true,
  providers: [MessageService, CustomToastService],
})
export default class DepuracionComponent implements OnDestroy {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public messageService = inject(MessageService);
  // onDepuracionCotizacionProveedor() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CotizacionProveedor')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // SolicitudCompra() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/SolicitudCompra').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // ReporteSemanal() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/ReporteSemanal').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // PrestamoHerramienta() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/PrestamoHerramienta')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // OrdenCompra() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/OrdenCompra').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // OrdenesServicio() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/OrdenesServicio').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // CalendarioMantenimiento() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CalendarioMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // Equipos() {
  //   // Mostrar un mensaje de carga
  // this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/Equipos').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // Recorrido() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/Recorrido').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // BitacoraMantenimiento() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/BitacoraMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // InventarioPintura() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/InventarioPintura')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // InventarioIluminacion() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/InventarioIluminacion')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // MachineryDocument() {
  //   // Mostrar un mensaje de carga
  // this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/MachineryDocument')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // CotizacionProveedorPendiente() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CotizacionProveedorPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // SolicitudCompraPendiente() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/SolicitudCompraPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // OrdenCompraPendiente() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/OrdenCompraPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         this.customToastService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // DeleteProveedor() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/DeleteProveedor').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       this.customToastService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }

  // Presentaciones() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Presentaciones')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // Reporte() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Reporte').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customToastService.onClose();
  //     }
  //   );
  // }
  // ActualizarDatos() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ActualizarDatos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // ActualizarDatosEmpleado() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ActualizarDatosEmpleado')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // HistorialAcceso() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/HistorialAcceso')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // MinutasParticipantesAdmin() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MinutasParticipantesAdmin')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // MinutasDetails() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MinutasDetails')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // MeetingDertailsSeguimientos() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MeetingDertailsSeguimientos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // OrdenCompraUpdate() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/OrdenCompra')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // MetodoDePagos() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MetodoDePagos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // OrdenCompraAuth() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/OrdenCompraAuth')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // Productos() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Productos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // Providers() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Providers')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // SalidaProducto() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SalidaProducto')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // ServiceOrders() {
  //   // Mostrar un mensaje de carga
  // this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ServiceOrders')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // SolicitudCompras() {
  //   // Mostrar un mensaje de carga
  // this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SolicitudCompras')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // SolicitudCompraDetalles() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SolicitudCompraDetalles')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // Tool() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Tool').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customToastService.onClose();
  //     }
  //   );
  // }

  // UsoCFDI() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/UsoCFDI').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customToastService.onClose();
  //     }
  //   );
  // }
  // AgendasSupervision() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/AgendasSupervision')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // InventarioExtintor() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioExtintor')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // InventarioIluminacions() {
  //   // Mostrar un mensaje de carga
  //   this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioIluminacions')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // Machinerys() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Machinerys')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // InventarioLlaves() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioLlaves')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // BitacoraMantenimientoUpdate() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/BitacoraMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // Medidor() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Medidor').subscribe(
  //     (resp: any) => {
  //       this.customToastService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customToastService.onClose();
  //     }
  //   );
  // }
  // ControlPrestamoHerramienta() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ControlPrestamoHerramienta')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  // UpdateCalendarId() {
  //   // Mostrar un mensaje de carga
  //  this.customToastService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ServiceOrders/UpdateCalendarId')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customToastService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customToastService.onClose();
  //       },
  //     });
  // }
  onEmployeeUpdate() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateEmployee')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  // }
  UpdateSalary() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateSalary')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  UpdateDocumentCustomer() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateDocumentCustomer')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  CreateAccounsFaltantes() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/CreateAccounsFaltantes')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  UpdateEmployeeToAccountUser() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateEmployeeToAccountUser')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  UpdatePerson() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdatePerson')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  UpdateProfession() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateProfession')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  WorkPosition() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/WorkPosition')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  RemovePerson() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/RemovePerson')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
