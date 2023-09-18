import { Routes } from '@angular/router';

export default [
  {
    path: 'inventario-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/inventario-productos/index-almacen-productos.component'
      ),
    title: 'Inventario',
  },
  {
    path: 'salida-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/salidas/index-salidas.component'
      ),
    title: 'Salida de inventario',
  },
  {
    path: 'entrada-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/entradas/index-entradas.component'
      ),
    title: 'Entrada de inventario',
  },
] as Routes;
