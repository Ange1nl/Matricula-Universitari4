import { Component, inject, signal } from '@angular/core';
import { RegistrarIngresadoService } from '../services/registrar-ingresado.service';
import { map, Observable } from 'rxjs';
import { EstudianteUniversidad } from '../models/estudiante-universidad';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar-alumnos',
  imports: [RouterLink, AsyncPipe, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './mostrar-alumnos.html',
  styleUrl: './mostrar-alumnos.css'
})
export class MostrarAlumnos {

  private service = inject(RegistrarIngresadoService);//Este es el servicio
  protected estud$!: Observable<EstudianteUniversidad[]>;



  //Ni bien se abre la pagina se ejecuta esto
  ngOnInit() {
    this.listarEstudiantes();
  }

  listarEstudiantes() {
    this.estud$ = this.service.getEstudiantes(); //Se guarda el observable en estud$ pero no hace la solicitud todavia recien ,EN EL HTML EN ESTA PARTE,  | async le dice a Angular: “Suscríbete al observable estud$ y espera su valor”.
  }


  dniBuscar: string = ''; //Esta variable lo ponemos en el html en el input, para que sea capturado

  buscarPorDni() {
    const dni = Number(this.dniBuscar);//Parseo como entero
    if (!dni) {
      alert("Ingrese un DNI válido");
      return;
    }
    this.estud$ = this.service.getEstudiantePorDni(dni).pipe(
      map(estudiante => [estudiante]) // Convertimos a array para que el @for del HTML funcione
    );
  }










  eliminarEstudiante(dni: number) {
    const confirmacion = confirm('¿Estás seguro de eliminar este estudiante?');
    if (!confirmacion) return;

    this.service.eliminar(dni).subscribe({
      next: () => {
        alert('Estudiante eliminado correctamente');
        this.listarEstudiantes(); // Volver a cargar la lista
      },
      error: (err) => {
        console.error('Error al eliminar', err);
        alert('Error al eliminar el estudiante');
      }
    });
  }



}
