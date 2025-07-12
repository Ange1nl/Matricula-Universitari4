import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CursoInfoCursoModels } from '../models/curso-info-curso-models';
import { CursoInfoCursoResponseModels } from '../models/curso-info-curso-response-models';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoInfocursoService {

  private URL = "http://localhost:8082/api/curso"
  private http = inject(HttpClient);

  //Para get es otra interfaz , ya que con esta interfaz mostraremos en html para poder editar y eliminar
  listar(): Observable<CursoInfoCursoResponseModels[]> {
    return this.http.get<CursoInfoCursoResponseModels[]>(`${this.URL}/listar`);
  }

  //Para insertar se ponen 2 interfaces , para enviar datos con esta interfaz "CursoInfoCursoModels" y el servidor responde con esta interfaz "CursoInfoCursoResponseModels" que incluye los ids y nombres de carrera
  //de hecho me devuelve en "CursoInfoCursoResponseModels" pero no me sirve aca , porque no lo utilizo en mi componente , lo que hago es volver a llamar al get
  insertar(CursoInfoCursoModels: CursoInfoCursoModels): Observable<CursoInfoCursoResponseModels> {
    return this.http.post<CursoInfoCursoResponseModels>(`${this.URL}/completo`, CursoInfoCursoModels);
  }

  //Aca en editar no es importante que me devuelva el id_curso porque ya esta capturado cuando se inserto , en el componente lo vuelve a capturar mediante el formulario reactivo y se actualiza
  editar(id: number, data: CursoInfoCursoModels): Observable<any> {
    return this.http.put<any>(`${this.URL}/editar/${id}`, data);
  }

  eliminar(id: number): Observable<CursoInfoCursoResponseModels> {
    return this.http.delete<CursoInfoCursoResponseModels>(`${this.URL}/eliminar/${id}`);
  }

  filtrarPorCarrera(idCarrera: number): Observable<CursoInfoCursoResponseModels[]> {
    return this.http.get<CursoInfoCursoResponseModels[]>(`${this.URL}/filtrar/${idCarrera}`);
  }

  //Para listar solo Curso , que sera llamado en la interfaz desde la interfaz Seccion , porque el formulario de seccion ,agrega curso
  listarCurso(): Observable <Curso[]>{
    return this.http.get<Curso[]>(`${this.URL}`);
  }


}
