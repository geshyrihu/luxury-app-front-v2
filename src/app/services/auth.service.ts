import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { IModelToken } from '../interfaces/IModelToken.interface';
import {
  InfoAccountAuthDto,
  InfoEmployeeAuthDto,
  UserTokenDto,
} from '../interfaces/auth/user-token.interface';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageService = inject(StorageService);
  private dataService = inject(DataService);
  private router = inject(Router);
  userTokenDto: UserTokenDto;
  infoUserAuthDto: InfoAccountAuthDto;
  infoEmployeeDto: InfoEmployeeAuthDto;

  statusJWT: boolean = false;
  data: IModelToken = { token: '' };
  validateRole: boolean = false;

  validationToken() {
    this.data.token = this.storageService.retireve('token');

    if (this.data.token === undefined) {
      this.router.navigateByUrl('/auth/login');
    }
    return this.dataService.post('Auth/ValidateJwtToken', this.data).pipe(
      map((resp: any) => {
        this.userTokenDto = resp.body;
        this.infoUserAuthDto = this.userTokenDto.infoUserAuthDto;
        this.infoEmployeeDto = this.userTokenDto.infoEmployeeDto;
        if (resp.body.token) {
          this.statusJWT = true;
        }
        return this.statusJWT;
      }),
      catchError((_) => of(false))
    );
  }

  onValidateRoles(roles: string[]): boolean {
    return this.userTokenDto.roles.some((item) => roles.includes(item));
  }
}
