import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from 'express';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Credenciales } from '../../features/auth/models/credenciales';
import { Token } from '../../features/auth/models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = "http://localhost:8082/api/v1/auth/autenticarse"
  private router = inject(Router);
  private http = inject(HttpClient);

  private isAuth = new BehaviorSubject<boolean>(this.hasToken());
  private isAuth$ = this.isAuth.asObservable();


  iniciarSesion(credenciales: Credenciales):Observable<Token>{
    return this.http.post<Token>(`${this.URL}/autenticarse`,credenciales)
     .pipe(tap(resp => {
      this.almacenarTokens(resp)
      this.isAuth.next(true);
      this.router.navigate(['/loginAdminRecep']); //Cuando cierra sesion lo manda a una pagina por defecto , en este caso a login
    }));
  }


  cerrarSesion(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuth.next(false);
    this.router.navigate(['/loginAdminRecep']); //Cuando cierra sesion lo manda a una pagina por defecto , en este caso a login
  }


  //Almacenar token
  private almacenarTokens(token: Token){
    localStorage.setItem('access_token',token.access_token);
    localStorage.setItem('refresh_token',token.refresh_token);
  }

  //Obtiene el token
  getTokenAccess(): string | null{
    return localStorage.getItem('access_token');
  }


  //Verificar si existe token
  hasToken(): boolean {
    return !!localStorage.getItem('access_token'); //Los 2 !! sirven para saber si existe un token o no
  }
  
}
