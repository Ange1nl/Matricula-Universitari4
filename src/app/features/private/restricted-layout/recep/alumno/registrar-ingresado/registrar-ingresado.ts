import { Component, inject } from '@angular/core';
import { RegistrarIngresadoService } from '../services/registrar-ingresado.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstudianteUniversidad } from '../models/estudiante-universidad';
import { AuthService } from '../../../../../../core/services/auth.service';

@Component({
  selector: 'app-registrar-ingresado',
  imports: [RouterLink, FormsModule, AsyncPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-ingresado.html',
  styleUrl: './registrar-ingresado.css'
})
export class RegistrarIngresado {

  private fb = inject(FormBuilder);
  protected estud$!: Observable<EstudianteUniversidad[]>;
  private service = inject(RegistrarIngresadoService);//Este es el servicio
  private authService = inject(AuthService);



  formulario!: FormGroup;

  ngOnInit() {

    this.formulario = this.fb.group({
      dni_estudiante: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      carrera: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fecha_registro: ['', [Validators.required]]
    });

    this.listarEstudiantes();
  }

  //Captura de mi auth.service.ts los nuevos metodos que agrege en este caso el idUsuario capturara para cuando haga el post enviar el idUsuario
  idUsuario = this.authService.getIdUsuario();

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



  modoEditar: boolean = false;
  dniParaEditar: number | null = null;

  editarAlumno(estudiante: EstudianteUniversidad) {
    this.formulario.patchValue({
      dni_estudiante: estudiante.dni_estudiante,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      correo: estudiante.correo,
      carrera: estudiante.carrera,
      telefono: estudiante.telefono,
      fecha_registro: estudiante.fecha_registro
    });

    this.dniParaEditar = estudiante.dni_estudiante;
    this.modoEditar = true;
  }


  registrarAlumno() {
    if (!this.idUsuario) {
      alert('No se encontró ID de usuario. Vuelva a iniciar sesión.');
      return;
    }

    //Para el post no usaremos tipado de interfaz , es decir nuestro objeto javascript no tendra tipado de interfaz sin embargo para get si usaremos la interfaz
    const datos = {
      ...this.formulario.value,
      usuario: {
        id_usuario: Number(this.idUsuario) // o parseInt(...) si lo prefieres
      }
    };


    if (this.modoEditar && this.dniParaEditar) {
      // EDITAR
      this.service.editar(this.dniParaEditar, datos).subscribe({
        next: () => {
          alert('Ingresante actualizado con éxito');
          this.listarEstudiantes();
          this.formulario.reset();
          this.modoEditar = false;
          this.dniParaEditar = null;
        },
        error: err => {
          console.error('Error al editar:', err);
          alert('Error al actualizar los datos');
        }
      });
    } else {

      this.service.agregar(datos).subscribe({
        next: () => {
          alert('Ingresante registrada con éxito');
          this.listarEstudiantes();
          this.formulario.reset();
        },
        error: (err) => {
          console.error('Error al registrar al nuevo alumno:', err);
          alert('Error al registrar el nuvo alumno');
        }
      });
    }
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
