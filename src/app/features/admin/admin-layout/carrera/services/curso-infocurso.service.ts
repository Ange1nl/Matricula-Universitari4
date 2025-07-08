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

  insertar(CursoInfoCursoModels: CursoInfoCursoModels): Observable <CursoInfoCursoModels>{
    return this.http.post<CursoInfoCursoModels>(`${this.URL}/completo`,CursoInfoCursoModels);
  }



}
