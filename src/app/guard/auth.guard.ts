import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const jwtHelper = inject(JwtHelperService);
  const authService = inject(AuthService)

  if (authService.isAuthenticated()) {
    console.log('route gurd true');
    return true;
  }
  const isRefreshSuccess = await authService.tryRefreshingTokens();
  if (!isRefreshSuccess) {
    console.log('rout gurd false');
    router.navigate(['/login']);
  }
  return isRefreshSuccess;
};
