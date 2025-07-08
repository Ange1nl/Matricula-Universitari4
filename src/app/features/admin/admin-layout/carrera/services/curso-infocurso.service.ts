import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CursoInfoCursoModels } from '../models/curso-info-curso-models';

@Injectable({
  providedIn: 'root'
})
export class CursoInfocursoService {

  private URL = "http://localhost:8082/api/curso"
  private http = inject(HttpClient);

  listar(): Observable <CursoInfoCursoModels[]>{
    return this.http.get<CursoInfoCursoModels[]>(`${this.URL}/listar`);
  }

  insertar(CursoInfoCursoModels: CursoInfoCursoModels): Observable <CursoInfoCursoModels>{
    return this.http.post<CursoInfoCursoModels>(`${this.URL}/completo`,CursoInfoCursoModels);
  }



}
