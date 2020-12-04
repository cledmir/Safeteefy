import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Guardian} from '../models/guardian';
import {catchError, retry} from 'rxjs/operators';
import {Urgency} from '../models/urgency';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {
  //
  basePath = 'http://localhost:3000/api';
  //
  constructor(private http: HttpClient) { }
  //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/json'
    })
  };
  //
  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.log('An error ocurred: ', error.error.message);
    }
    else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something happened with request, please try again later.');
  }
  // Guardian
  getAllGuardians(): Observable<Guardian>{
    return this.http.get<Guardian>(`${this.basePath}/guardians`)
      .pipe(retry(2), catchError(this.handleError));
  }
  getGuardian(id): Observable<Guardian>{
    return this.http.get<Guardian>(`${this.basePath}/guardians/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // Urgencies
  createUrgency(guardianId, item): Observable<Urgency> {
    return this.http.post<Urgency>(`${this.basePath}/guardians/${guardianId}/urgencies?new`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  getAllUrgenciesByGuardian(guardianId): Observable<Urgency> {
    return this.http.get<Urgency>(`${this.basePath}/guardians/${guardianId}/urgencies`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  updateUrgency(id, guardianId, item): Observable<Urgency>{
    return this.http.put<Urgency>(`${this.basePath}/guardians/${guardianId}/urgencies/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  deleteUrgency(id, guardianId): Observable<any> {
    return this.http.delete<Urgency>(`${this.basePath}/guardians/${guardianId}/urgencies/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
