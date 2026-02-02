import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

export function HttpErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const _snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      _snackBar.open(error.message, undefined, {
        duration: 9000,
        panelClass: ['snackbar-error'],
      });
      throw throwError(() => error);
    }),
  );
}
