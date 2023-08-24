import { Routes } from '@angular/router';

export default [
  {
    path: 'reporte-operacion/:customer/:inicio/:final',
    loadComponent: () =>
      import('src/app/pages/public/report-client/report-client.component'),
  },
  {
    path: 'reporte-minuta/:customer/:id',
    loadComponent: () =>
      import('src/app/pages/public/report-meeting/report-meeting.component'),
  },
] as Routes;
