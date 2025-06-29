import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authServ = inject(AuthService)
  const token = authServ.getTokenAccess();

  if (token) {
    const cloneReq = req.clone({
      //No vees que en postman se ponia el token y hacias la peticion en este caso ponemos la cabecera y capturamos el token con el que inicio sesion y que se guardo en el navegador para hacer la peticion
      headers: req.headers.set('Authorization',`Bearer ${token}`)//Toma el token del usuario logueado desde el localStorage y lo añade a la cabecera Authorization para autenticar la petición.
    });
    return next(cloneReq)
  }

  return next(req)

  //El guard es para proteger las paginas
  //El interceptor es para que a mis otras consultas cuando ya me loguie , les setee el token

};
