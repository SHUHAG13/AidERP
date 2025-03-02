import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../services/common/spinner.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const sppinerService = inject(SpinnerService);
  sppinerService.show();
  
  return next(req).pipe(
    //delay(5000),
    finalize(() => sppinerService.hide())
  )
};
