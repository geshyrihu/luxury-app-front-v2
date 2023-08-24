import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('src/app/pages/auth/router-login/dash-panel.component'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('src/app/pages/auth/login/login.component'),
        title: 'Login',
      },
      {
        path: 'restablecer-contrasena',
        loadComponent: () =>
          import(
            'src/app/pages/auth/restore-password/restore-password.component'
          ),
        title: 'Restablecer contraseña',
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import(
            'src/app/pages/auth/recover-password/recover-password.component'
          ),
        title: 'Recuperar contraseña',
      },
    ],
  },
] as Routes;
