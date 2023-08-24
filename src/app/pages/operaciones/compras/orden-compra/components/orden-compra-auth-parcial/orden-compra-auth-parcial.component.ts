// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
// import { PipesModule } from 'src/app/pipes/pipes.module';
// import { OrdenCompraService } from 'src/app/services/orden-compra.service';

// @Component({
//   selector: 'app-orden-compra-auth-parcial',
//   templateUrl: './orden-compra-auth-parcial.component.html',
//   standalone: true,
//   imports: [CommonModule, PipesModule],
// })
// export default class OrdenCompraAuthParcialComponent {
//   public ordenCompraService = inject(OrdenCompraService);
//   @Input()
//   ordenCompra: any;
//   @Input()
//   bloqueada: boolean;

//   @Input()
//   mostarBotonAutorizarSup: boolean;
//   @Input()
//   mostarBotonAutorizarRes: boolean;

//   @Input()
//   mostarBotonRevocar: boolean;

//   @Input()
//   isSupervisionOperativa: boolean;

//   @Output()
//   modalOrdenCompra: EventEmitter<string> = new EventEmitter();
//   @Output()
//   ModalcompraNoAutorizada: EventEmitter<string> = new EventEmitter();

//   @Output()
//   onBotonAutorizarSup: EventEmitter<string> = new EventEmitter();
//   @Output()
//   onBotonAutorizarRes: EventEmitter<string> = new EventEmitter();
//   @Output()
//   onBotonNoAutorizada: EventEmitter<string> = new EventEmitter();

//   onModalOrdenCompra() {
//     this.modalOrdenCompra.emit();
//   }
//   onModalcompraNoAutorizada() {}
// }
