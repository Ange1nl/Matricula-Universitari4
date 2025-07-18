import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seccion } from '../models/seccion';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private URL = "http://localhost:8082/api/EstudianteLogin"
  private http = inject(HttpClient);

  
  getSeccionesPorCurso(cursoId: number): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.URL}/curso/${cursoId}`);
  }
  
}
