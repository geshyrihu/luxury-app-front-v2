import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerIdService {
  customerId: number = 0;
  private customerId$ = new Subject<number>();

  constructor(public authService: AuthService) {
    if (this.authService.userTokenDto) {
      this.customerId =
        this.authService.userTokenDto.infoUserAuthDto.customerId;
    }
  }
  setCustomerId(customerId: number) {
    this.customerId = customerId;
    this.customerId$.next(customerId);
  }

  getCustomerId$(): Observable<number> {
    return this.customerId$.asObservable();
  }

  getcustomerId() {
    return this.customerId;
  }
}
