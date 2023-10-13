import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CustomSwalService {
  /**
   * Muestra una ventana emergente de carga.
   */
  onLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
  }

  /**
   * Cierra la ventana emergente actual.
   */
  onClose() {
    Swal.close();
  }

  /**
   * Muestra una ventana emergente de error con un mensaje personalizado.
   * @param mensaje Mensaje de error a mostrar.
   */
  onLoadingError(mensaje: string) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      title: 'Error',
      text: mensaje,
    });
  }
}
