import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CursoInfoCursoModels } from '../models/curso-info-curso-models';
import { CursoInfoCursoResponseModels } from '../models/curso-info-curso-response-models';

@Injectable({
  providedIn: 'root'
})
export class CursoInfocursoService {

  private URL = "http://localhost:8082/api/curso"
  private http = inject(HttpClient);

  //Para get es otra interfaz , ya que con esta interfaz mostraremos en html para poder editar y eliminar
  listar(): Observable <CursoInfoCursoResponseModels[]>{
    return this.http.get<CursoInfoCursoResponseModels[]>(`${this.URL}/listar`);
  }

  //Para insertar se ponen 2 interfaces , para enviar datos con esta interfaz "CursoInfoCursoModels" y el servidor responde con esta interfaz "CursoInfoCursoResponseModels" que incluye los ids y nombres de carrera
  //de hecho me devuelve en "CursoInfoCursoResponseModels" pero no me sirve aca , porque no lo utilizo en mi componente , lo que hago es volver a llamar al get
  insertar(CursoInfoCursoModels: CursoInfoCursoModels): Observable <CursoInfoCursoResponseModels>{
    return this.http.post<CursoInfoCursoResponseModels>(`${this.URL}/completo`,CursoInfoCursoModels);
  }

  editar(id: number, data: CursoInfoCursoModels): Observable <CursoInfoCursoResponseModels>{
    return this.http.put<CursoInfoCursoResponseModels>(`${this.URL}/editar/${id}`, data);
  }

  eliminar(id: number): Observable<CursoInfoCursoResponseModels> {
    return this.http.delete<CursoInfoCursoResponseModels>(`${this.URL}/eliminar/${id}`);
  }

}
