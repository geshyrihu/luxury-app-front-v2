import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public messageService = inject(MessageService);

  /**
   * Muestra un mensaje de éxito.
   */
  onShowSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito!',
      detail: 'Operación completada',
    });
  }

  /**
   * Muestra un mensaje de información.
   * @param detail Detalles del mensaje de información.
   */
  onShowInfo(detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: detail,
    });
  }

  /**
   * Muestra un mensaje de advertencia.
   * @param detail Detalles del mensaje de advertencia.
   */
  onShowWarn(detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: detail,
    });
  }

  /**
   * Muestra un mensaje de error.
   */
  onShowError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo completar la tarea',
    });
  }
}
