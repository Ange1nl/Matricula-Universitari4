import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarreraService } from '../../services/carrera.service';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Carrera } from '../../models/carrera';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CursoInfocursoService } from '../../services/curso-infocurso.service';
import { CursoInfoCursoModels } from '../../models/curso-info-curso-models';
import { CursoInfoCursoResponseModels } from '../../models/curso-info-curso-response-models';

@Component({
  selector: 'app-curso-info-curso',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './curso-info-curso.html',
  styleUrl: './curso-info-curso.css'
})
export class CursoInfoCurso {

  protected carreras$!: Observable<Carrera[]>;//Para el get

  //La parte del backend para listar esta bien , porque para inicializar con datos el behaviro Subject , se inicializo co datos , de la database 
  private cursosSubject = new BehaviorSubject<CursoInfoCursoResponseModels[]>([]); //Lo inicializo con un array vacio , cuando inserto un valor , todos los que estan suscrito a ese BehaviorSubject recien automaticamente el nuevo valor
  protected cursoInfoCursoResponse$ = this.cursosSubject.asObservable(); //Al tener .asObservable(), puedes usar | async en el HTML sin preocuparte por el subscribe().

  /*BehaviorSubject es como una caja que siempre guarda el último valor enviado.
  Cuando tú (el componente) te suscribes, recibes automáticamente el último valor guardado.Si cambias algo (por ejemplo, agregas un curso), solo haces .next(nuevosDatos) y todos los que están mirando esa "caja" verán el cambio al instante.
  Esto evita volver a pedir datos al servidor innecesariamente y actualiza la tabla sin recargar la página ni navegar.Ideal cuando quieres que la interfaz se mantenga actualizada en tiempo real después de un cambio.*/

  protected cursosAgregados: CursoInfoCursoModels[] = [];


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

  get nombre(){return this.formulario.get('nombre');}
  get id_carrera(){return this.formulario.get('id_carrera');}
  get ciclo(){return this.formulario.get('ciclo');}
  get horaSemanal(){return this.formulario.get('horaSemanal');}
  get credito(){return this.formulario.get('credito');}
  get tipo(){return this.formulario.get('tipo');}


  ngOnInit() {
    this.obtenerCarreras();
    this.listarCursoInfoCurso();
  }


  //Para obtener las carreras
  obtenerCarreras(): void {
    this.carreras$ = this.carreraServ.listar(); //Asignacion directa al observable
  }

  //listar Curso e info del curso
  listarCursoInfoCurso(): void {
    this.serv.listar().subscribe({
      next: (data) => {
        console.log('CURSOS:', data); // Verifica que los cursos tengan id_curso
        this.cursosSubject.next(data);
      }, error: (err) => console.error('Error al listar cursos:', err)
    });
  }

  guardarCurso(): void {
    if (this.formulario.invalid) return;

    const nuevo: CursoInfoCursoModels = this.formulario.value;

    this.serv.insertar(nuevo).subscribe({
      next: (nuevoCursoDesdeBackend: CursoInfoCursoResponseModels) => {
        // Agrega el nuevo curso directamente a la lista actual con los IDs y nombreCarrera correctos
        //Actualiza la tabla solo con el nuevo curso , sin necesidad de estar haciendo otro get
        const actual = this.cursosSubject.value;
        this.cursosSubject.next([...actual, nuevoCursoDesdeBackend]);
        this.formulario.reset();

        //this.listarCursoInfoCurso()// refresca la tabla con el nuevo
      },
      error: (err) => {
        console.error("Error al guardar el curso", err);
      }
    });

  }



  editarCurso(curso:CursoInfoCursoResponseModels){
    this.formulario.patchValue({
      nombre: curso.nombre,
      id_carrera: curso.id_carrera,
      ciclo: curso.ciclo,
      horaSemanal: curso.horaSemanal,
      credito: curso.credito,
      tipo: curso.tipo
    });

    //this.editandoId = curso.id_curso;
  }


  eliminarCurso(id_curso: number){
    if (confirm ('¿Estas seguro que deseas eliminar este curso?')) {
      this.serv.eliminar(id_curso).subscribe({
        next: () => {
          //Obtiene todo el array completo de cursos hasta ese momento
          const actual  = this.cursosSubject.value;
          //Remueve el curso con el id_curso mandado por el usuario
          const actualizado = actual.filter(curso => curso.id_curso !== id_curso);
          this.cursosSubject.next(actualizado);
        },
        error: (err) => {
          console.log('Error al eliminar un curso:', err);
        }
      });
    }
  }

}
