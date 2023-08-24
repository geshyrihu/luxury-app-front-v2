import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private storeService = inject(StorageService);

  private authSource = new Subject<boolean>();
  authChallenge$ = this.authSource.asObservable();

  //.... Obtener el valor del Token
  getToken(): any {
    return this.storeService.retireve('token');
  }

  // Remover los valores del storaSession
  resetAuthData() {
    this.storeService.remove('token');
  }

  // Se asigna los valores a las claves en el storaSession
  setAuthData(token: string) {
    this.storeService.store('token', token);
  }

  logOff() {
    this.resetAuthData();
  }
}
