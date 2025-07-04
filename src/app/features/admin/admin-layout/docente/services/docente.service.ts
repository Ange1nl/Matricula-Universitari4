import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Docente } from '../models/docente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  private URL = "http://localhost:8082/api/profesores"
  private URL_IMG = "http://localhost:8082/api/imagen/upload-img";

  private http = inject(HttpClient);

  // El observable se encarga de enviar la solicitud al servidor (por ejemplo: listar, insertar, buscar por ID) Cuando el servidor responde, el observable emite esa respuesta (la "devuelve").
  // Esta respuesta se define en el servicio, y se consume en el componente usando .subscribe(). En operaciones como GET o buscar por ID, el componente necesita la respuesta (por eso se usa).
  // En cambio, para acciones como insertar, a veces solo te interesa ejecutar la acción y no necesitas capturar el objeto insertado. Aun así, debes suscribirte para que la operación se realice, aunque no uses la respuesta.

  listar(): Observable<Docente[]> { //Indica el tipo de Observable que es si no ponemos entendera que es obsevable any
    return this.http.get<Docente[]>(`${this.URL}/listar`); //El observable es lo que retorna this.http.get<Docente[]>
  }

  insertar(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(`${this.URL}/insertar`, docente);
  }

  subirImagen(formData: FormData): Observable<string> {
    return this.http.post(this.URL_IMG, formData, { responseType: 'text' }); //Me devuelve el nombre unico generado algo asi "f3c9a77a-e2c2-4fd5-826b-d7c2a4573f3f_mifoto.jpg" en texto plano no en JSON
  }

  obtenerPorId(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.URL}/lista/${id}`);
  }

  editar(id: number, docente:Docente): Observable<Docente>{
    return this.http.put<Docente>(`${this.URL}/actualizar/${id}`, docente);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.URL}/eliminar/${id}`,{ responseType: 'text' });
  }


}
