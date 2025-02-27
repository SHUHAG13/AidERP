import { HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, filter, Observable, Subject, switchMap, take, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/SecurityAdministration/auth/auth.service';
import { Router } from '@angular/router';
import { Common } from '../shared/library/common';

let isRefreshing = false; // Flag to prevent multiple refresh attempts
let refreshSubject: Subject<boolean> | null = null; // Subject to share the same refresh response

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip adding the token for the login and refresh token endpoints
  if (req.url.includes('Auth/Login') || req.url.includes('Auth/RefreshToken')) {
    return next(req); // No token added for these requests
  }

  // Clone the request and add the Authorization header with the Bearer token
  const clonedRequest = req.clone(Common.getApiHeader());

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If a 401 error occurs, try refreshing the token
        console.log(isRefreshing);
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject = new Subject();

          // Attempt to refresh the token
          authService.tryRefreshingTokens().then((isSuccess) => {
            if (isSuccess) {
              // If token refresh is successful, notify all waiting requests
              refreshSubject?.next(true);
            } else {
              // If refresh fails, redirect to login
              authService.logout();
              refreshSubject?.next(false);
            }
          }).catch(() => {
            // If the refresh token fails, navigate to login page
            authService.logout();
            refreshSubject?.next(false);
          }).finally(() => {
            // Reset the flag whether refresh was successful or not
            refreshSubject?.complete();
            refreshSubject = null; // Reset to allow new refresh attempts
            isRefreshing = false;
          });
        }

        // Wait for the token refresh to complete
        return refreshSubject!.pipe(
          filter(status => status === true), // Only retry requests if refresh was successful
          take(1), // Ensures each request retries only ONCE
          switchMap(() => next(req.clone(Common.getApiHeader()))) // Retry with new token
        );       
      }

      // Handle other errors
      switch (error.status) {
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

      return throwError(() => error);
    })
  );
};
