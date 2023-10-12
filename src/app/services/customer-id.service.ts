import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerIdService {
  customerId: number = 0; // Valor predeterminado para el ID del cliente
  private customerId$ = new Subject<number>(); // Observable para el ID del cliente

  constructor(public authService: AuthService) {
    // Al construir el servicio, se intenta obtener el ID del cliente desde AuthService
    if (this.authService.userTokenDto) {
      this.customerId =
        this.authService.userTokenDto.infoUserAuthDto.customerId;
    }
  }

  /**
   * Establece el ID del cliente y notifica a los observadores.
   * @param customerId El ID del cliente a establecer.
   */
  setCustomerId(customerId: number) {
    this.customerId = customerId;
    this.customerId$.next(customerId); // Notificar a los observadores sobre el cambio en el ID del cliente.
  }

  /**
   * Obtiene un observable que emite el ID del cliente cuando cambia.
   * @returns Un observable que emite el ID del cliente cuando cambia.
   */
  getCustomerId$(): Observable<number> {
    return this.customerId$.asObservable();
  }

  /**
   * Obtiene el valor actual del ID del cliente.
   * @returns El valor actual del ID del cliente.
   */
  getcustomerId() {
    return this.customerId;
  }
}
