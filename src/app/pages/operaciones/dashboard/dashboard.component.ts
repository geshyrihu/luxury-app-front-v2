import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import BitacoraMantenimientoComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/recorridos/bitacora-mantenimiento.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import DashboardMinutasComponent from './dashboard-minutas/dashboard-minutas.component';
import DashboardTicketsComponent from './dashboard-tickets/dashboard-tickets.component';
import MantenimientosPreventivosComponent from './mttos-preventivos/mttos-preventivos.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    BitacoraMantenimientoComponent,
    MantenimientosPreventivosComponent,
    DashboardMinutasComponent,
    DashboardTicketsComponent,
    ComponentsModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class DashboardComponent {
  private modalService = inject(NgbModal);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);

  ref: DynamicDialogRef;

  /**
   * Open extra large modal
   * @param exlargeModal extra large modal data
   */
  extraLarge(exlargeModal: any) {
    this.modalService.open(exlargeModal, {
      size: 'xl',
      windowClass: 'modal-holder',
      centered: true,
      scrollable: true,
    });
  }
}
