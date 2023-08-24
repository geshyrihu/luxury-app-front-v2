import { Routes } from '@angular/router';

export default [
  {
    path: 'proveedor',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/proveedor/dashboard-proveedor/dashboard-proveedor.component'
      ),
  },
  {
    path: 'condominos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/condominos/index-condominos.component'
      ),
  },
  {
    path: 'propiedades',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/propiedades/index-propiedades.component'
      ),
  },
  {
    path: 'comite-vigilancia',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/comite-vigilancia/index-comite-vigilancia.component'
      ),
  },
  {
    path: 'empleados/:parametro',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/empleados/list-employee.component'
      ),
  },
  {
    path: 'empleados-general',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/empleados/index-employee-all.component'
      ),
  },
  {
    path: 'telefonos-emergencia',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/telefonos-emergencia/telefonos-emergencia.component'
      ),
  },
  {
    path: 'organigrama-interno',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/organigrama-interno/organigrama-interno.component'
      ),
  },
] as Routes;
