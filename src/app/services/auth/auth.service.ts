import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MasterService } from '../common/master.service';
import { Router } from '@angular/router';
import { Login } from '../../core/models/auth/login';
import { CustomResponse } from '../../core/models/common/response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private jwtHelper : JwtHelperService,
    private masterService : MasterService,
    private router : Router
  ){}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    console.log(token);
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated()
  }

  login(user : Login) {
    return this.masterService.post<CustomResponse>('Auth/Login',user);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  // refresh token

  async tryRefreshingTokens(): Promise<boolean> {

    try{
      const jwt: any = localStorage.getItem('token');
      const refreshToken: any = localStorage.getItem('refreshToken');
      if (!jwt || !refreshToken) { return false; }

      const credentials = JSON.stringify({
        accessToken: jwt,
        refreshToken: refreshToken,
      });

      let isRefreshSuccess: boolean;

      const refreshRes = await new Promise<CustomResponse>(
        (resolve, reject) => {
          this.masterService.post<CustomResponse>('Auth/RefreshToken', credentials)
          .subscribe({
              next: (res: CustomResponse) => {
                res.success ? resolve(res) : reject({ message: res.message });
              },
              error: (e) => {
                reject({ message: e.error.message, error: e })
              },
            });
        }
      );
      
      isRefreshSuccess = true;
      localStorage.setItem('token', refreshRes.data.token);
      localStorage.setItem('refreshToken', refreshRes.data.refreshToken);
      return isRefreshSuccess;
    }
    catch(error : any){
      console.error('Error occurred:', error.message);
      return false;
    }
  }
}
