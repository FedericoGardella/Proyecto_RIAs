import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let clonedRequest = req;

  if(localStorage.getItem('authToken')) {
    clonedRequest = req.clone({
      headers: req.headers.set('Authorization',`Bearer ${localStorage.getItem('authToken')!}`),
    });
  }
  
  return next(clonedRequest);
};
