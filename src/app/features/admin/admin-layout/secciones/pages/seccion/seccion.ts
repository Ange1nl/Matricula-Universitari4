import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenteService } from '../../../docente/services/docente.service';
import { Docente } from '../../../docente/models/docente';
import { Observable } from 'rxjs';
import { CursoInfocursoService } from '../../../carrera/services/curso-infocurso.service';
import { Curso } from '../../../carrera/models/curso';

@Component({
  selector: 'app-seccion',
  imports: [CommonModule, ReactiveFormsModule, ReactiveFormsModule, FormsModule, AsyncPipe],
  templateUrl: './seccion.html',
  styleUrl: './seccion.css'
})
export class Seccion {

  private serv = inject(DocenteService);
  private servi = inject(CursoInfocursoService);
  private fb = inject(FormBuilder);

  protected docen$!: Observable<Docente[]>;
  protected curso$!: Observable<Curso[]>;


  protected formulario: FormGroup = this.fb.group({
    id_curso: ['', Validators.required],
    horario: [null, Validators.required],
    aula: [null, Validators.required],
    id_profesor: ['', Validators.required],
    cupos: [null, Validators.required, ],
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

  }


}
