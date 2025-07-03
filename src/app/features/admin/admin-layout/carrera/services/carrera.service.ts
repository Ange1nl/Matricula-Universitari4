import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrera } from '../models/carrera';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private URL = "http://localhost:8082/api/carrera"
  private http = inject(HttpClient);


  obtener(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.URL}/listar`);
  }

  insertar(carrera: Carrera): Observable<Carrera>{
    return this.http.post<Carrera>(`${this.URL}/insertar`, carrera);
  }

  obtenerPorId(id: number): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.URL}/lista/${id}`);
  }

  editar(id:number,carrera: Carrera): Observable<Carrera>{
    return this.http.put<Carrera>(`${this.URL}/actualizar/${id}`, carrera);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.URL}/eliminar/${id}`,{responseType: 'text'});
  }


}
