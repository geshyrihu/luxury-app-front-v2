import { Routes } from '@angular/router';

export default [
  {
    path: 'documento',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/documentos/documento/index-documento.component'
      ),
  },
  {
    path: 'poliza',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/documentos/contrato-poliza/index-contrato-poliza.component'
      ),
  },
  // {
  //   path: 'view-documento',
  //   loadComponent: () =>
  //     import(
  //       'src/app/pages/operaciones/documentos/pdf-viewer/pdf-viewer.component'
  //     ),
  // },
  {
    path: 'documento',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/documentos/documento/index-documento.component'
      ),
  },
] as Routes;
