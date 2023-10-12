import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import CustomButtonComponent from 'src/app/shared/custom-buttons/custom-button/custom-button.component';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonComponent],
  standalone: true,
})
export default class DepuracionComponent implements OnDestroy {
  private dataService = inject(DataService);
  private swalService = inject(SwalService);

  // onDepuracionCotizacionProveedor() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CotizacionProveedor')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // SolicitudCompra() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/SolicitudCompra').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // ReporteSemanal() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/ReporteSemanal').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // PrestamoHerramienta() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/PrestamoHerramienta')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // OrdenCompra() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/OrdenCompra').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // OrdenesServicio() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/OrdenesServicio').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // CalendarioMantenimiento() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CalendarioMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // Equipos() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/Equipos').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // Recorrido() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/Recorrido').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }
  // BitacoraMantenimiento() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/BitacoraMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // InventarioPintura() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/InventarioPintura')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // InventarioIluminacion() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/InventarioIluminacion')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // MachineryDocument() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/MachineryDocument')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // CotizacionProveedorPendiente() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/CotizacionProveedorPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // SolicitudCompraPendiente() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/SolicitudCompraPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // OrdenCompraPendiente() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('Depuracion/OrdenCompraPendiente')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         this.swalService.onClose();
  //         console.log(err.error);
  //       },
  //     });
  // }
  // DeleteProveedor() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('Depuracion/DeleteProveedor').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       this.swalService.onClose();
  //       console.log(err.error);
  //     }
  //   );
  // }

  // Presentaciones() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Presentaciones')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // Reporte() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Reporte').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.swalService.onClose();
  //     }
  //   );
  // }
  // ActualizarDatos() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ActualizarDatos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // ActualizarDatosEmpleado() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ActualizarDatosEmpleado')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // HistorialAcceso() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/HistorialAcceso')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // MinutasParticipantesAdmin() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MinutasParticipantesAdmin')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // MinutasDetails() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MinutasDetails')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // MeetingDertailsSeguimientos() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MeetingDertailsSeguimientos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // OrdenCompraUpdate() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/OrdenCompra')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // MetodoDePagos() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/MetodoDePagos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // OrdenCompraAuth() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/OrdenCompraAuth')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // Productos() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Productos')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // Providers() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Providers')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // SalidaProducto() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SalidaProducto')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // ServiceOrders() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ServiceOrders')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // SolicitudCompras() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SolicitudCompras')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // SolicitudCompraDetalles() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/SolicitudCompraDetalles')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // Tool() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Tool').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.swalService.onClose();
  //     }
  //   );
  // }

  // UsoCFDI() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/UsoCFDI').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.swalService.onClose();
  //     }
  //   );
  // }
  // AgendasSupervision() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/AgendasSupervision')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // InventarioExtintor() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioExtintor')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // InventarioIluminacions() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioIluminacions')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // Machinerys() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/Machinerys')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // InventarioLlaves() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/InventarioLlaves')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // BitacoraMantenimientoUpdate() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/BitacoraMantenimiento')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // Medidor() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService.get('ActualizarCuentas/Medidor').subscribe(
  //     (resp: any) => {
  //       this.swalService.onClose();
  //     },
  //     (err) => {
  //       console.log(err.error);
  //       this.swalService.onClose();
  //     }
  //   );
  // }
  // ControlPrestamoHerramienta() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ActualizarCuentas/ControlPrestamoHerramienta')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  // UpdateCalendarId() {
  //   this.swalService.onLoading();
  //   this.subRef$ = this.dataService
  //     .get('ServiceOrders/UpdateCalendarId')
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.swalService.onClose();
  //       },
  //       error: (err) => {
  //         console.log(err.error);
  //         this.swalService.onClose();
  //       },
  //     });
  // }
  onEmployeeUpdate() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateEmployee')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  // }
  UpdateSalary() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateSalary')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  UpdateDocumentCustomer() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateDocumentCustomer')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  CreateAccounsFaltantes() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/CreateAccounsFaltantes')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  UpdateEmployeeToAccountUser() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateEmployeeToAccountUser')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  UpdatePerson() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdatePerson')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  UpdateProfession() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/UpdateProfession')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  WorkPosition() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/WorkPosition')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  RemovePerson() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('UpdateDataBase/RemovePerson')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
