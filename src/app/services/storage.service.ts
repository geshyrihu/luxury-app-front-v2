import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: any;
  constructor() {
    this.storage = localStorage;
  }

  // Metodo para obeter el valor de la clave asignada en sessio storage
  retireve(key: string): any {
    const item = this.storage.getItem(key);

    if (item && item !== 'undefined') {
      return JSON.parse(item);
      // return item;
    }
    return;
  }
  // Metodo para agregar clave y valor en session storage
  store(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  // Metodo para remover el valor de una clave
  remove(key: string) {
    this.storage.removeItem(key);
  }
}
