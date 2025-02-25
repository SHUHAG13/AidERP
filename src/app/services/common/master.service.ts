import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Common } from '../../shared/library/common';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private apiUrl = Common.getApiBaseUrl();

  constructor(private http: HttpClient) {}

  // GET request method
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<T>(url);
  }

  // POST request method
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(url, data);
  }

  // PUT request method
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.put<T>(url, data);
  }

  // DELETE request method
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.delete<T>(url);
  }
}
