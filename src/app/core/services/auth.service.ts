import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Credenciales } from '../../features/auth/models/credenciales';
import { Token } from '../../features/auth/models/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = "http://localhost:8082/api/v1/auth"
  private router = inject(Router);
  private http = inject(HttpClient);

  private isAuth = new BehaviorSubject<boolean>(this.hasToken());
  public isAuth$ = this.isAuth.asObservable();


  iniciarSesion(credenciales: Credenciales):Observable<Token>{
    return this.http.post<Token>(`${this.URL}/autenticarse`,credenciales)
     .pipe(tap(resp => {
      this.almacenarTokens(resp) //Osea en aca guarda los tokens en el navegador una vez inicie sesion
      this.isAuth.next(true);//si es autenticado, retorna true y el guards ya sabe que es true y deja acceder a la pagina, pagina que esta debajo de esta linea
      
      //despues de recibir el token valido y almacenar el token me manda a esta ruta
      //this.router.navigate(['/admin']); 

      switch (resp.rol) {
        case 'ADMIN':
          this.router.navigate(['/restringido/panelAdmin']);
          break;
        case 'RECEP':
          this.router.navigate(['/restringido/panelRecep']);
          break;
        default:
          this.router.navigate(['/loginAdminRecep']); // ruta por defecto
          break;
      }

    }));
  }


  cerrarSesion(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');
    this.isAuth.next(false); 
    this.router.navigate(['/loginAdminRecep']); //Cuando cierra sesion lo manda a una pagina por defecto , en este caso a login
  }


  //Aca almacena los tokens y es llamado en iniciarSesion (Sí, el token se almacena en el navegador, específicamente en el localStorage, localStorage.setItem(...): es una función del navegador web que guarda datos de forma persistente, incluso si se recarga la página o se cierra el navegador.)
  private almacenarTokens(token: Token){
    localStorage.setItem('access_token',token.access_token); //Aca especificamos que el token se almacenara en en navegador
    localStorage.setItem('refresh_token',token.refresh_token);
    localStorage.setItem('nombre', token.nombre);
    localStorage.setItem('idUsuario', token.id_usuario.toString());
    localStorage.setItem('rol', token.rol);
  }

  //Obtiene el token del navegador (Generalmente para mandarselo al interceptor)
  getTokenAccess(): string | null{
    return localStorage.getItem('access_token');
  }


  //Verificar si existe token
  hasToken(): boolean {
    return !!localStorage.getItem('access_token'); //Los 2 !! sirven para saber si existe un token o no
  }
  
}
