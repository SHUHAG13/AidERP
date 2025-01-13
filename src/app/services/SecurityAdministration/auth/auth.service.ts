import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MasterService } from '../../common/master.service';
import { Router } from '@angular/router';
import { Login } from '../../../core/securityAdministration/auth/login';
import { CustomResponse } from '../../../core/common/response';

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
    if (!token) {
      console.error('Token is null or undefined.');
      return false;
    }
  
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error('Token is not a valid JWT format:', token);
      return false;
    }
  
    // Safely check token expiration
    try {
      const isExpired = this.jwtHelper.isTokenExpired(token);
      console.log('Is token expired:', isExpired);
      return !isExpired; // Return true if not expired
    } catch (error) {
      console.error('Error in JwtHelperService.isTokenExpired:', error);
      return false;
    }
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
    console.log("Hello from Auth Gurard");
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
                console.log(res)
                res.success ? resolve(res) : reject({ message: res.message });
              },
              error: (e) => {
                console.log(e)
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
