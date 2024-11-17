import { Injectable } from '@angular/core';
import { User } from '../../core/models/auth.models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MasterService } from '../common/master.service';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from '../../core/models/auth/authenticated-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private jwtHelper : JwtHelperService,
    private masterService : MasterService,
    private router : Router,
    private http : HttpClient
  ){}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated()
  }

  login(user : User) {
    this.masterService.post('login',user);
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login']);
  }
  // refresh token

  async tryRefreshingTokens(): Promise<boolean> {

    const jwt: any = localStorage.getItem('token');
    const refreshToken: any = localStorage.getItem('refreshToken');
    if (!jwt || !refreshToken) {
      return false;
    }

    const credentials = JSON.stringify({
      accessToken: jwt,
      refreshToken: refreshToken,
    });
    let isRefreshSuccess: boolean;

    const refreshRes = await new Promise<AuthenticatedResponse>(
      (resolve, reject) => {
        this.http
          .post<AuthenticatedResponse>(
            'https://localhost:7140/api/token/refresh',
            credentials,
            {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
              }),
            }
          )
          .subscribe({
            next: (res: AuthenticatedResponse) => {
              resolve(res);
              console.log(res);
            },
            error: (e) => {
              reject;
              isRefreshSuccess = false;
            },
          });
      }
    );
    localStorage.setItem('token', refreshRes.token);
    localStorage.setItem('refreshToken', refreshRes.refreshToken);
    isRefreshSuccess = true;
    return isRefreshSuccess;
  }
}
