import { Component, inject } from '@angular/core';
import { RegistrarIngresadoService } from '../services/registrar-ingresado.service';
import { Observable,map  } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstudianteUniversidad } from '../models/estudiante-universidad';

@Component({
  selector: 'app-registrar-ingresado',
  imports: [RouterLink, FormsModule, AsyncPipe,CommonModule],
  templateUrl: './registrar-ingresado.html',
  styleUrl: './registrar-ingresado.css'
})
export class RegistrarIngresado {


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
