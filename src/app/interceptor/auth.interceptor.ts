import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { Common } from '../shared/library/common';
import { inject } from '@angular/core';
import { AuthService } from '../services/SecurityAdministration/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  // Skip adding the token for the login endpoint
  if (req.url.includes('/login')) {
    return next(req); // No token added
  }
  // same as refresh token validation not needed
  // if (req.url.includes('/login')) {
  //   return next(req); // No token added
  // }

  // Clone the request and add the Authorization header with the Bearer token  
  const clonedRequest = req.clone( Common.getApiHeader() );

  return next(clonedRequest).pipe(

    retry(2), // Retry the request twice before failing

    catchError((error: HttpErrorResponse)=>{
      switch (error.status){
        case 400:
          console.error('Bad Request:',error.error);
          alert('Invalid request. Please check your inputs.');
          break;
        case 401:
          authService.logout();
          console.error('Unauthorized:',error.error);
          alert('Session expired. Please log in again.');
          break;
        case 403:
          console.error('Forbidden:', error.error);
          alert('You do not have permission to access this resource.');
          break;
        case 404:
          console.error('Not Found:', error.error);
          alert('The requested resource was not found.');
          break;
        case 500:
          console.error('Server Error:', error.error);
          alert('An internal server error occurred. Please try again later.');
          break;
        default:
          console.error('Unknown Error:', error.error);
          alert('An unexpected error occurred. Please try again.');
      }

      return throwError (() => error);
    })
  );
};
