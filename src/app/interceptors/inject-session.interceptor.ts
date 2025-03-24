import { HttpInterceptorFn } from '@angular/common/http';

export const injectSessionInterceptor: HttpInterceptorFn = (req, next) => {

  try {
    // console.log('hola ✅✅✅');

    let newRequest = req

    newRequest = req.clone({
      setHeaders: {
        authorization: localStorage.getItem('token') || '',
      }
    })

    return next(newRequest);
  } catch (error) {
    console.log('🔴🔴🔴 Ojito error', error);
    return next(req);
  }

  // return next(req);
};
