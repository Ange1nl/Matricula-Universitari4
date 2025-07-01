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


  listar():Observable<Docente[]>{
    return this.http.get<Docente[]>(`${this.URL}/listar`);
  }

  insertar(docente:Docente){
    return this.http.post(`${this.URL}/insertar`,docente);
  }

  subirImagen(formData: FormData){
    return this.http.post(this.URL_IMG,formData,{responseType:'text'}); //Me devuelve el nombre unico generado algo asi "f3c9a77a-e2c2-4fd5-826b-d7c2a4573f3f_mifoto.jpg" en texto plano no en JSON
  }

  editar(docente: Docente){
    return this.http.put<Docente>(`${this.URL}/actualizar`, docente);
  }

  eliminar(){

  }
 
  
}
