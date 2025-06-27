import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EstudianteUniversidad } from '../models/estudiante-universidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarIngresadoService {

  private URL="http://localhost:8082/api/EstudianteUniversidad"
  private http = inject(HttpClient);

  getEstudiantes():Observable<EstudianteUniversidad[]>{
    return this.http.get<EstudianteUniversidad[]>(`${this.URL}/lista`);
    //this.http.get(...) , No hace la peticion inmediata es como una promesa pendiente que mas adelante el servidor respondera, es como decir me llega la solicitud  desde algun componente ts y lo busco en el servidor(Backend) lo encuentro y te respondo enviando los datos en formato JSON si el backend lo establecio asi
  }

  agregar(estudiante: EstudianteUniversidad): Observable<EstudianteUniversidad> {
    return this.http.post<EstudianteUniversidad>(`${this.URL}/insertar`, estudiante);
  }


  editar(dni: number, estudiante: EstudianteUniversidad): Observable<EstudianteUniversidad> {
    return this.http.put<EstudianteUniversidad>(`${this.URL}/actualizar/${dni}`, estudiante);
  }

  eliminar(dni: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/eliminar/${dni}`);
  }


}
