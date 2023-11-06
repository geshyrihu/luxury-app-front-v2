import {
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import localeEsMX from '@angular/common/locales/es-MX';
import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { Routes, provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxMaskModule } from 'ngx-mask';
import { AppComponent } from './app/app.component';
import { AutosizeDirective } from './app/directives/autosize-text-area.diective';
import { AuthGuard } from './app/guards/auth.guard';
import { LayoutComponent } from './app/layouts/layout.component';
import { JwtInterceptor } from './app/services/jwt-interceptor.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./app/routing/pages.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./app/routing/auth.routing'),
  },
  {
    path: 'publico',
    loadChildren: () => import('./app/routing/public.routing'),
  },
  {
    path: 'compras',
    loadChildren: () => import('./app/routing/compras.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'utillidades',
    loadChildren: () => import('./app/routing/utillidades.routing'),
    canActivate: [AuthGuard],
  },
];
registerLocaleData(localeEsMX);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AutosizeDirective,
      TranslateModule.forRoot({
        defaultLanguage: 'es',
      }),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerWhenStable:30000',
      }),
      FlatpickrModule.forRoot(),
      BrowserModule,
      NgxMaskModule.forRoot()
    ),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-MX',
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom([BrowserModule, BrowserAnimationsModule]),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
