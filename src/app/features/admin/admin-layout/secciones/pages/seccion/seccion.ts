import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenteService } from '../../../docente/services/docente.service';
import { Docente } from '../../../docente/models/docente';
import { Observable } from 'rxjs';
import { CursoInfocursoService } from '../../../carrera/services/curso-infocurso.service';
import { Curso } from '../../../carrera/models/curso';
import { SeccionService } from '../../services/seccion.service';

@Component({
  selector: 'app-seccion',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AsyncPipe],
  templateUrl: './seccion.html',
  styleUrl: './seccion.css'
})
export class Seccion {

  private serv = inject(DocenteService);
  private servi = inject(CursoInfocursoService);
  private seccionServ = inject(SeccionService);
  private fb = inject(FormBuilder);

  protected docen$!: Observable<Docente[]>;
  protected curso$!: Observable<Curso[]>;


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
    this.obtenerCursos();
  }


  cargarDocentes() {
    this.docen$ = this.serv.listar();
  }

  obtenerCursos(): void {
    this.curso$ = this.servi.listarCurso();
  }



  agregarSeccion() {

    if (this.formulario.invalid) return;

    const form = this.formulario.value;

    const nuevaSeccion = {
      curso: { id_curso: form.id_curso },
      horario: form.horario,
      aula: form.aula,
      profesores: { id_profesor: form.id_profesor },
      cupos: form.cupos,
      modalidad: form.modalidad
    };
    /*
    this.seccionServ.insertar(nuevaSeccion).subscribe({
      next: (data) => {
        console.log('Sección insertada con éxito:', data);
        this.formulario.reset();
      },
      error: (err) => {
        console.error('Error al insertar sección:', err);
      }
    });*/

  }


}
