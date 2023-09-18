import { Routes } from '@angular/router';

export default [
  {
    path: 'profesiones',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/professions/list-professions.component'
      ),
  },
  {
    path: 'plantilla-interna',
    title: 'Plantilla interna',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/plantilla/list-plantilla.component'
      ),
  },

  {
    path: 'departamentos',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/area-responsable/list-area-responsable.component'
      ),
    title: 'Areas Responsables',
  },
  {
    path: 'candidatos-vacante/:positionRequestId',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/list-solicitudes/list-solicitud-vacantes/list-vacante-candidatos/list-vacante-candidatos.component'
      ),
    title: 'Candidatos para vacantes',
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/list-solicitudes/reclutamiento-solicitudes-router.component'
      ),
    loadChildren: () => import('./reclutamiento-solicitudes.routing'),
  },
  {
    path: 'status-solicitud-vacante',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/status-requests/status-position-request/status-position-request.component'
      ),
  },
  {
    path: 'status-solicitud-baja',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/status-requests/status-request-dismissal/status-request-dismissal.component'
      ),
  },
  {
    path: 'status-solicitud-modificacion-salario',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/status-requests/status-request-salary-modification/status-request-salary-modification.component'
      ),
  },
  {
    path: 'candidatos',
    loadComponent: () =>
      import(
        'src/app/pages/administrativa/reclutamiento/list-candidates/list-candidates.component'
      ),
  },
] as Routes;
