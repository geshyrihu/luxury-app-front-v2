import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/contabilidad-pendientes-minuta/cont-list-minuta-pendientes.component'
      ),
  },

  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
  },
  {
    path: 'pendientes-minutas-pdf',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/cont-minuta-pendientes-pdf/cont-minuta-pendientes-pdf.component'
      ),
  },
  {
    path: 'bancos',
    loadComponent: () =>
      import('src/app/pages/configuracion/bancos/index-banco.component'),
  },
  {
    path: 'catalogo-cuentas',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/presupuesto-cuentas/list-ledger-accounts.component'
      ),
  },
  {
    path: 'forma-pago',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/forma-pago/index-forma-pago.component'
      ),
  },
  {
    path: 'metodo-pago',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/metodo-pago/index-metodo-pago.component'
      ),
  },
  {
    path: 'uso-cfdi',
    loadComponent: () =>
      import('src/app/pages/configuracion/uso-cfdi/index-uso-cfdi.component'),
  },
  {
    path: 'cedulas-presupuestales',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/presupuesto/list-cedulas-presupuestales.component'
      ),
  },
  // {
  //   path: 'cedula-presupuestal-detalle/:id',
  //   loadComponent: () =>
  //     import(
  //       'src/app/pages/administrativa/contabilidad/presupuesto/detalle-cedula-presupuestal.component'
  //     ),
  // },
] as Routes;
