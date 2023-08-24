import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

const urlBase = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  /*GET */
  get<T>(url: string, httpParams?: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get<T>(urlBase + url, {
      headers: httpHeaders,
      params: httpParams,
      observe: 'response',
    });
  }

  /*GET FILE */
  getFile(url: string, httpParams?: any): Observable<Blob> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get<Blob>(urlBase + url, {
      headers: httpHeaders,
      params: httpParams,
      responseType: 'blob' as 'json', // Especificar el tipo de respuesta como 'blob'
    });
  }

  /*POST */
  post<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.post<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
  /*PUT */
  put<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.put<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
  /*DELETE */
  delete<T>(url: string, params?: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.delete<T>(urlBase + url, {
      headers: httpHeaders,
      observe: 'response',
    });
  }

  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();

    // const token = this.securityService.getToken();
    // if (token) {
    //   httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    // }
    return httpHeaders;
  }
}
