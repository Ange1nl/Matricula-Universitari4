import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RequestRegistroModel } from '../models/request-registro-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private URL = "http://localhost:8082/api/EstudianteSistema";
  private http = inject(HttpClient);

  insertar(requestRegistroModel: RequestRegistroModel): Observable <void>{
    console.log("Petición enviada:", requestRegistroModel);
    return this.http.post<void>(`${this.URL}/insertar`,requestRegistroModel)
  }

}
