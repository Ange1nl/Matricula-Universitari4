import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarreraService } from '../../services/carrera.service';
import { Observable } from 'rxjs';
import { Carrera } from '../../models/carrera';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CursoInfocursoService } from '../../services/curso-infocurso.service';
import { CursoInfoCursoModels } from '../../models/curso-info-curso-models';
import { CursoInfoCursoResponseModels } from '../../models/curso-info-curso-response-models';

@Component({
  selector: 'app-curso-info-curso',
  imports: [RouterLink,CommonModule,ReactiveFormsModule,AsyncPipe],
  templateUrl: './curso-info-curso.html',
  styleUrl: './curso-info-curso.css'
})
export class CursoInfoCurso {

  private carreraServ = inject(CarreraService); //servicio de carrera
  private serv = inject(CursoInfocursoService); //servicio de CursoInfoCurso
  private fb = inject(FormBuilder);


  protected formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    id_carrera: ['', Validators.required],
    ciclo: [null, [Validators.required, Validators.min(1)]],
    horaSemanal: ['', Validators.required],
    credito: [null, [Validators.required, Validators.min(1)]],
    tipo: ['', Validators.required]
  });

  protected carreras: Carrera[] = []; // <- array auxiliar para .find()
  protected carreras$!: Observable<Carrera[]>;//Para el get
  protected cursoInfoCursoResponse$!: Observable<CursoInfoCursoResponseModels[]>;//Para el get
  protected cursosAgregados: CursoInfoCursoModels[] = [];

  ngOnInit() {
    this.obtenerCarreras();
    this.listarCursoInfoCurso();
  }


  //Para obtener las carreras
  obtenerCarreras(): void {
    this.carreras$ = this.carreraServ.listar(); //Asignacion directa al observable
    this.carreras$.subscribe({
    next: (data) => {
      this.carreras = data; // <- necesario para obtener el nombre
    }
  });
  }

  //listar Curso e info del curso
  listarCursoInfoCurso(){
    this.cursoInfoCursoResponse$ = this.serv.listar();
  }

  guardarCurso():void{
    if (this.formulario.invalid) return
    {}

    const nuevo:CursoInfoCursoModels = this.formulario.value;

    this.serv.insertar(nuevo).subscribe({
      next:() => {
        this.formulario.reset();
        this.cursoInfoCursoResponse$ = this.serv.listar(); //Al inicio se ejecuta el cursoInfoCursoResponse$ pero por como funciona el |async puede no volver a renderizar detecta que no cambio su valor y no se actuazliza  es por eso que al guardar vuelvo a llamar a ese metodo para que se muestre en la tabla mi ultimo dato
        this.listarCursoInfoCurso();
      },
      error: (err) => {
        console.error("Error al guardar el curso", err);
      }
    });

  }


}
