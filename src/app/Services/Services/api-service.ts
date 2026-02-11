import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from '../Loader/loader-service';
import { catchError, finalize, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  baseUrl: string = 'http://13.62.7.157:8080/docktour-backend'

  constructor(private http: HttpClient, private loader: LoaderService) {}

  get<T>(endpoint: string, params: any = {}, showLoader = true): Observable<any> {
    if (showLoader) this.loader.show();

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {...params} ).pipe(
      finalize(() => showLoader && this.loader.hide()),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  post<T>(endpoint: string, body: any, showLoader = true): Observable<T> {
    if (showLoader) this.loader.show();

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      finalize(() => showLoader && this.loader.hide()),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('API Error:', error); // log for debugging
    return throwError(() => error);     // re-throw so component can handle it
  }
}
