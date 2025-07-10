import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionesModels } from '../models/secciones-models';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  private URL = "http://localhost:8082/api/seccion"
  private http = inject(HttpClient);

  listar(): Observable<SeccionesModels[]> {
    return this.http.get<SeccionesModels[]>(`${this.URL}/listar`);
  }

  insertar(seccionModels: SeccionesModels): Observable<SeccionesModels> {
    return this.http.post<SeccionesModels>(`${this.URL}/insertar`, seccionModels);
  }

  editar(id: number, seccionModels: SeccionesModels): Observable<SeccionesModels> {
    return this.http.put<SeccionesModels>(`${this.URL}/actualizar/${id}`, seccionModels);
  }

  eliminar(id: number): Observable<SeccionesModels> {
    return this.http.delete<SeccionesModels>(`${this.URL}/eliminar/${id}`);
  }

}
