import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RecepcionModels } from '../models/recepcion-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  private URL = "http://localhost:8082/api/v1/auth"
  private http = inject(HttpClient);

  insertar(recepcionModels: RecepcionModels): Observable <void>{
    return this.http.post<void>(`${this.URL}/registro`,recepcionModels)
  }
  
}
