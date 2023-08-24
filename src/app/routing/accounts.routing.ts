import { Routes } from '@angular/router';

export default [
  {
    path: 'cuentas-usuario',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/list-account/list-account.component'
      ),
  },
  {
    path: 'actualizar-perfil',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/update-profile/update-profile.component'
      ),
  },
  {
    path: 'datos-email',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/email-data/list-email-data.component'
      ),
  },
  {
    path: 'cliente',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/account-customer/account-customer.component'
      ),
  },
] as Routes;
