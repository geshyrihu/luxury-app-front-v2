import { Routes } from '@angular/router';

export default [
  {
    path: 'inventario-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/inventario-productos/index-almacen-productos.component'
      ),
  },
  {
    path: 'salida-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/salidas/index-salidas.component'
      ),
  },
  {
    path: 'entrada-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/entradas/index-entradas.component'
      ),
  },
] as Routes;
