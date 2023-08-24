import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ETipoGastoPipe } from 'src/app/pipes/tipo-gasto.pipe';

@Component({
  selector: 'app-orden-compra-datos-pago-parcial',
  templateUrl: './orden-compra-datos-pago-parcial.component.html',
  standalone: true,
  imports: [ETipoGastoPipe],
})
export default class OrdenCompraDatosPagoParcialComponent {
  @Input()
  ordenCompra: any;
  @Input()
  bloqueada: boolean;
  @Output()
  modalOrdenCompra: EventEmitter<string> = new EventEmitter();

  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }
}
