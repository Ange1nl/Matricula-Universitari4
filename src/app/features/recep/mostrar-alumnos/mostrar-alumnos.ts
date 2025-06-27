import { Component, inject } from '@angular/core';
import { RegistrarIngresadoService } from '../services/registrar-ingresado.service';
import { Observable } from 'rxjs';
import { EstudianteUniversidad } from '../models/estudiante-universidad';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mostrar-alumnos',
  imports: [RouterLink,AsyncPipe],
  templateUrl: './mostrar-alumnos.html',
  styleUrl: './mostrar-alumnos.css'
})
export class MostrarAlumnos{

  private service = inject(RegistrarIngresadoService);//Este es el servicio
  protected estud$!: Observable<EstudianteUniversidad[]>;

  getEstudiantes(){
    this.estud$ = this.service.getEstudiantes(); //Se guarda el observable en estud$ pero no hace la solicitud todavia recien ,EN EL HTML EN ESTA PARTE,  | async le dice a Angular: “Suscríbete al observable estud$ y espera su valor”.
  }

  //Ni bien se abre la pagina se ejecuta esto
  ngOnInit(){
    this.getEstudiantes();
  }
  


}
