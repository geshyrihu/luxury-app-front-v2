import { Routes } from '@angular/router';

export default [
  {
    path: 'tiket-mantenimiento',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/list-ticket/list-ticket.component'
      ),
  },
  {
    path: 'reporte-terminados',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/reporte-terminados/reporte-operacion.component'
      ),
  },
  {
    path: 'reporte-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/reporte-pendientes/pending-report.component'
      ),
  },
  {
    path: 'line-time',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/line-time-operation-report/line-time-operation-report.component'
      ),
  },
] as Routes;
