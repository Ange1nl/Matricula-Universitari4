import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  private URL = "http://localhost:8082/api/profesores"
  private URL_IMG = "http://localhost:8082/api/imagen/upload-img";

  private http = inject(HttpClient);


  listar(){

  }

  insertar(docente:any){
    return this.http.post(`${this.URL}/insertar`,docente);
  }

  subirImagen(formData: FormData){
    return this.http.post(this.URL_IMG,formData,{responseType:'text'});
  }

  editar(){

  }

  eliminar(){

  }
 
  
}
