import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  DataService,
} from 'src/app/services/common-services';
import CustomButtonComponent from 'src/app/shared/custom-buttons/custom-button/custom-button.component';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonComponent],
  standalone: true,
})
export default class DepuracionComponent implements OnDestroy {
  private dataService = inject(DataService);
  private customSwalService = inject(CustomSwalService);

  // onDepuracionCotizacionProveedor() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CotizacionProveedor')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // SolicitudCompra() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/SolicitudCompra').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // ReporteSemanal() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/ReporteSemanal').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // PrestamoHerramienta() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/PrestamoHerramienta')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // OrdenCompra() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/OrdenCompra').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // OrdenesServicio() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/OrdenesServicio').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // CalendarioMantenimiento() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CalendarioMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // Equipos() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/Equipos').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // Recorrido() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/Recorrido').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // BitacoraMantenimiento() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/BitacoraMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // InventarioPintura() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/InventarioPintura')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // InventarioIluminacion() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/InventarioIluminacion')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // MachineryDocument() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/MachineryDocument')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // CotizacionProveedorPendiente() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CotizacionProveedorPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // SolicitudCompraPendiente() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/SolicitudCompraPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // OrdenCompraPendiente() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/OrdenCompraPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         this.customSwalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // DeleteProveedor() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/DeleteProveedor').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       this.customSwalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }

  // Presentaciones() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Presentaciones')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // Reporte() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Reporte').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customSwalService.onClose();
  //     }
  //   );
  // }
  // ActualizarDatos() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ActualizarDatos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // ActualizarDatosEmpleado() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ActualizarDatosEmpleado')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // HistorialAcceso() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/HistorialAcceso')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // MinutasParticipantesAdmin() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MinutasParticipantesAdmin')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // MinutasDetails() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MinutasDetails')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // MeetingDertailsSeguimientos() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MeetingDertailsSeguimientos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // OrdenCompraUpdate() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/OrdenCompra')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // MetodoDePagos() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MetodoDePagos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // OrdenCompraAuth() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/OrdenCompraAuth')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // Productos() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Productos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // Providers() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Providers')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // SalidaProducto() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SalidaProducto')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // ServiceOrders() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ServiceOrders')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // SolicitudCompras() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SolicitudCompras')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // SolicitudCompraDetalles() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SolicitudCompraDetalles')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // Tool() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Tool').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customSwalService.onClose();
  //     }
  //   );
  // }

  // UsoCFDI() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/UsoCFDI').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customSwalService.onClose();
  //     }
  //   );
  // }
  // AgendasSupervision() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/AgendasSupervision')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // InventarioExtintor() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioExtintor')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // InventarioIluminacions() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioIluminacions')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // Machinerys() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Machinerys')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // InventarioLlaves() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioLlaves')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // BitacoraMantenimientoUpdate() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/BitacoraMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // Medidor() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Medidor').subscribe(
  //     (resp: any) => {
  //       this.customSwalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.customSwalService.onClose();
  //     }
  //   );
  // }
  // ControlPrestamoHerramienta() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ControlPrestamoHerramienta')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  // UpdateCalendarId() {
  //   this.customSwalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ServiceOrders/UpdateCalendarId')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.customSwalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.customSwalService.onClose();
  //       },
  //     });
  // }
  onEmployeeUpdate() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateEmployee')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  // }
  UpdateSalary() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateSalary')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  UpdateDocumentCustomer() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateDocumentCustomer')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  CreateAccounsFaltantes() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/CreateAccounsFaltantes')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  UpdateEmployeeToAccountUser() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateEmployeeToAccountUser')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  UpdatePerson() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdatePerson')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  UpdateProfession() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateProfession')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  WorkPosition() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/WorkPosition')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  RemovePerson() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/RemovePerson')
      .subscribe({
        next: (_) => {
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
