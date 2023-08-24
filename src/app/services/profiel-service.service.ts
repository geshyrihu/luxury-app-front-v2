import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfielServiceService {
  private imagenPerfilActualizada = new Subject<{}>();

  imagenPerfilActualizada$ = this.imagenPerfilActualizada.asObservable();

  actualizarImagenPerfil(imagenUrl: string) {
    this.imagenPerfilActualizada.next({ imagenUrl: imagenUrl });
  }
}
