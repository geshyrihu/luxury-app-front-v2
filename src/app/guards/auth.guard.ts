import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  public authService = inject(AuthService);
  private route = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.validationToken().pipe(
      tap((JWTisValid) => {
        if (!JWTisValid) {
          this.route.navigateByUrl('/auth/login');
        }
      })
    );
  }
}
