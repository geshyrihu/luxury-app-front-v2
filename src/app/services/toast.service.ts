import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public messageService = inject(MessageService);

  onShowSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Exito!',
      detail: 'Operación completada',
    });
  }

  onShowInfo(detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: detail,
    });
  }

  onShowWarn(detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: detail,
    });
  }

  onShowError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo completar la tarea',
    });
  }
}
