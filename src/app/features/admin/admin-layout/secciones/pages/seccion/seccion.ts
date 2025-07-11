import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenteService } from '../../../docente/services/docente.service';
import { Docente } from '../../../docente/models/docente';
import { BehaviorSubject, Observable } from 'rxjs';
import { CursoInfocursoService } from '../../../carrera/services/curso-infocurso.service';
import { Curso } from '../../../carrera/models/curso';
import { SeccionService } from '../../services/seccion.service';
import { SeccionesModels } from '../../models/secciones-models';
import { SeccionEnvioModels } from '../../models/seccion-envio-models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seccion',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AsyncPipe, RouterLink],
  templateUrl: './seccion.html',
  styleUrl: './seccion.css'
})
export class Seccion {

  private docenServ = inject(DocenteService);
  private cursoServ = inject(CursoInfocursoService);
  private seccionServ = inject(SeccionService);
  private fb = inject(FormBuilder);

  protected docen$!: Observable<Docente[]>;
  protected curso$!: Observable<Curso[]>;
  protected secciones$!: Observable<SeccionesModels[]>;

  /*
  private seccionesSubject = new BehaviorSubject<SeccionesModels[]>([]);
  protected secciones$ = this.seccionesSubject.asObservable();
  */



  formulario: FormGroup = this.fb.group({
    id_curso: ['', Validators.required],
    horario: ['', Validators.required],
    aula: ['', Validators.required],
    id_profesor: ['', Validators.required],
    cupos: [null, Validators.required],
    modalidad: ['', Validators.required]
  });


  ngOnInit() {
    this.cargarDocentes();
    this.cargarCursos();
    this.obtenerSecciones();
  }

  //PARA MI COMBO BOX SE MUESTRE LOS DOCENTES NOMAS ES
  cargarDocentes() {
    this.docen$ = this.docenServ.listar();
  }

  //PARA MI COMBO BOX SE MUESTRE LOS CURSOS NOMAS ES
  cargarCursos(): void {
    this.curso$ = this.cursoServ.listarCurso();
  }


  obtenerSecciones() {
    this.secciones$ = this.seccionServ.listar();
    /*this.seccionServ.listar().subscribe({
      next: (data) => this.seccionesSubject.next(data) //data es lo que me devuelve del service es decir hago la peticion get, el backend responde y es este data que se agregara al array
    });*/
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = 0;
    this.formulario.reset();
  }

  editando: boolean = false;
  idEditando!: number;

  editarSeccion(seccion: SeccionesModels) {
    this.editando = true;
    this.idEditando = seccion.idSeccion; //Captura el idSeccion

    this.formulario.patchValue({ //Como ya capturo el idSeccion es colocado en los inputs del html sus demas datos
      id_curso: seccion.curso.id_curso,
      horario: seccion.horario,
      aula: seccion.aula,
      id_profesor: seccion.profesores.id_profesor,
      cupos: seccion.cupos,
      modalidad: seccion.modalidad
    });
  }


  agregarSeccion() {

    if (this.formulario.invalid) return;

    const form = this.formulario.value;

    const seccionEnvio: SeccionEnvioModels = { //Pongo la interfaz por buena practica , solo asegura el tipado y que coincida tanto aca cuando envio al backend
      curso: { id_curso: form.id_curso }, //Para que en curso se mande solo el id_curso es decir curso = id_curso
      horario: form.horario,
      aula: form.aula,
      profesores: { id_profesor: form.id_profesor }, //profesores = id_profesor
      cupos: form.cupos,
      modalidad: form.modalidad
    };

    if (this.editando) {
      this.seccionServ.editar(this.idEditando, seccionEnvio).subscribe({
        next: () => {
          this.editando = false;
          this.idEditando = 0;
          this.formulario.reset();
          this.obtenerSecciones();
        },
        error: (err) => {
          console.error("Error al editar el curso:", err);
          if (err.status === 400 && err.error) {
            const errores = err.error;

            for (const campo in errores) {
              const control = this.formulario.get(campo); // Busca el campo correspondiente en el formulario
              if (control) {
                control.setErrors({ backend: errores[campo] }); // Asigna el mensaje como error personalizado
              }
            }
          }
        }
      });
    } else {
      this.seccionServ.insertar(seccionEnvio).subscribe({
        next: () => { //El data es lo que me devuelve, asi next (data), cuando hago el post , me devuelve en JSON y es ese data ese JSON devuelto, aca no tiene data , pero igual dejo el comentario xd        
          this.formulario.reset();
          this.obtenerSecciones(); // actualiza tabla
        },

        error: (err) => {
          console.error("Error al agregar el curso:", err);
          if (err.status === 400 && err.error) {
            const errores = err.error;
            for (const campo in errores) {
              const control = this.formulario.get(campo); // Busca el campo correspondiente en el formulario
              if (control) {
                control.setErrors({ backend: errores[campo] }); // Asigna el mensaje como error personalizado
              }
            }
          }
        }

      });
    }
  }


  eliminarSeccion(id: number) {
    if (!confirm('¿Está seguro de eliminar esta sección?')) return;

    this.seccionServ.eliminar(id).subscribe({
      next: () => {
        this.obtenerSecciones();
      },
      error: (err) => {
        console.error('Error al eliminar sección:', err);
      }
    });
  }


}
