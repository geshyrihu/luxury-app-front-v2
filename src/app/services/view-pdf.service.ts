import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewPdfService {
  urlBase = environment.base_urlImg;
  url: string = '';

  setNameDocument(nameDocument: string): void {
    this.url = this.urlBase + nameDocument;
  }

  //TODO: REVISAR QUE SE BORRE DE MEMORIA ULTIMO ARCHIVO CARGADO

  getNameDocument(): string {
    return this.url;
  }
}
