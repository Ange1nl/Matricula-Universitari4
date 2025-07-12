import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authServ = inject(AuthService);
  const router = inject(Router);

  return authServ.isAuth$.pipe(
    take(1), //Esto ayuda , ya que ese observable puede estar cambiando de false a true , esto toma el ultimo elemento y se desuscribe, para saber si en el ultimo espacio de tiempo esta o no logeado
    map(isAuth => { //Si autenticado es verdadero me retorana true , si es falso me manda a login
      if(isAuth) {
        return true;
      }else {
        router.navigate(['/loginAdminRecep']);
        return false;
      }
    })
  )

};
