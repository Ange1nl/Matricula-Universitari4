import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionesModels } from '../models/secciones-models';
import { SeccionEnvioModels } from '../models/seccion-envio-models';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  private URL = "http://localhost:8082/api/seccion"
  private http = inject(HttpClient);

  listar(): Observable<SeccionesModels[]> {
    return this.http.get<SeccionesModels[]>(`${this.URL}/listar`);
  }

  //Consume este metodo el servidor me responde en formato JSON con el tipado SeleccionesModels pero no lo uso porque generalmente eso se usa con el BehaviorSubject es decir me devuelve el dato y en el componente , cuando me suscribo, next(data) , en data esta lo que me devuelve y eso puedo ponerlo al behavior subject y actualizar simplemente el array
  //pero como aca tiene relacion con otras entidades , cuando es POST y PUT solo me devuelve los ids y los demas campos de los FK son nulos y eso hace en el html que algunos campos de los fk no se muestren . En cambio en get internamente busca la relacion y si te devuelve todo los datos, comprobado con postman
  insertar(seccionEnvioModels: SeccionEnvioModels): Observable<SeccionesModels> {
    return this.http.post<SeccionesModels>(`${this.URL}/insertar`, seccionEnvioModels);
  }

  editar(id: number, seccionEnvioModels: SeccionEnvioModels): Observable<SeccionesModels> {
    return this.http.put<SeccionesModels>(`${this.URL}/actualizar/${id}`, seccionEnvioModels);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/eliminar/${id}`);
  }

}
