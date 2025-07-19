import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seccion } from '../models/seccion';
import { MatriculaResponse } from '../models/matricula-response';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private URL = "http://localhost:8082/api/EstudianteLogin"
  private http = inject(HttpClient);

  //Mostrar las secciones de ese curso
  getSeccionesPorCurso(cursoId: number): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(`${this.URL}/curso/${cursoId}`);
  }


  procesarMatricula(payload: { codigo_estudiante: number; id_secciones: number[] }) {
    return this.http.post<MatriculaResponse[]>(`${this.URL}/procesar`, payload);
  }

  getSeccionesByIds(ids: number[]) {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<Seccion[]>(`${this.URL}/secciones/by-ids`, { params });
  }

}
