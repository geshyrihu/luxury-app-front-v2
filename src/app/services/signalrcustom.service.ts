import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
const url = environment.base_signalr;
@Injectable({
  providedIn: 'root',
})
export class SignalrcustomService {
  public hubConnection: HubConnection;
  constructor() {
    console.log('SignalrcustomService iniciado!!!ffff');

    let builder = new HubConnectionBuilder();
    this.hubConnection = builder.withUrl(`${url}cnn`).build();

    this.hubConnection.start();

    this.hubConnection.on('Nueva solicitud', (respuesta) => {
      console.log('hubConnection: ', respuesta);
    });
  }
}
