import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarreraService } from '../../services/carrera.service';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Carrera } from '../../models/carrera';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CursoInfocursoService } from '../../services/curso-infocurso.service';
import { CursoInfoCursoModels } from '../../models/curso-info-curso-models';
import { CursoInfoCursoResponseModels } from '../../models/curso-info-curso-response-models';
import { Curso } from '../../models/curso';

@Component({
  selector: 'app-curso-info-curso',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, AsyncPipe, FormsModule,],
  templateUrl: './curso-info-curso.html',
  styleUrl: './curso-info-curso.css'
})
export class CursoInfoCurso {

  protected carreras$!: Observable<Carrera[]>;
  protected curso$!: Observable<Curso[]>;

  //La parte del backend para listar , porque para inicializar con datos el behaviro Subject , se inicializo con datos , de la database 
  private cursosSubject = new BehaviorSubject<CursoInfoCursoResponseModels[]>([]); //Lo inicializo con un array vacio , cuando inserto un valor , todos los que estan suscrito a ese BehaviorSubject recien automaticamente el nuevo valor
  protected cursoInfoCursoResponse$ = this.cursosSubject.asObservable(); //Al tener .asObservable(), puedes usar | async en el HTML sin preocuparte por el subscribe().

  /*BehaviorSubject es como una caja que siempre guarda el último valor enviado.Cuando (el componente) te suscribes, recibes automáticamente el último valor guardado.Si cambias algo (por ejemplo, agregas un curso), solo haces .next(nuevosDatos) y todos los que están mirando esa "caja" verán el cambio al instante.
  Esto evita volver a pedir datos al servidor innecesariamente y actualiza la tabla sin recargar la página ni navegar.Ideal cuando quieres que la interfaz se mantenga actualizada en tiempo real después de un cambio.*/

  private carreraServ = inject(CarreraService);
  private serv = inject(CursoInfocursoService);
  private fb = inject(FormBuilder);

  // Este FormGroup define todas las validaciones.
  // Estas validaciones controlan tanto: el estado del botón (si el formulario es válido) y Los mensajes en el HTML, mediante los getters (como nombre.hasError('required'))
  protected formulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
    id_carrera: [null, Validators.required],
    ciclo: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
    horaSemanal: ['', Validators.required],
    credito: [null, [Validators.required, Validators.min(1), Validators.max(9)]],
    tipo: ['', Validators.required]
  });

  //Estos getters permiten acceder fácilmente desde el HTML a los controles del formulario.
  // Ejemplo: @if (nombre?.hasError('required')) { ... }
  get nombre() { return this.formulario.get('nombre'); }
  get id_carrera() { return this.formulario.get('id_carrera'); }
  get ciclo() { return this.formulario.get('ciclo'); }
  get horaSemanal() { return this.formulario.get('horaSemanal'); }
  get credito() { return this.formulario.get('credito'); }
  get tipo() { return this.formulario.get('tipo'); }


  ngOnInit() {
    this.obtenerCarreras();
    this.listarCursoInfoCurso();
  }

  protected editandoId: number | null = null;

  private resetFormulario(): void {
    this.formulario.reset();
    this.editandoId = null;
  }

  //Obtener los cursos
  obtenerCursos(): void{
    this.curso$ = this.serv.listarCurso();
  }

  //Para obtener las carreras
  obtenerCarreras(): void {
    this.carreras$ = this.carreraServ.listar(); //Asignacion directa al observable
  }

  //listar Curso e info del curso, podria hacerlo con el $ pero carga de forma brusca , por eso use el use el BehaviorSubject para que se cree un array y carge en la vista del navegador mas ligero , cuando se hace get , post y put
  listarCursoInfoCurso(): void {
    this.serv.listar().subscribe({
      next: (data) => {
        this.cursosSubject.next(data); // ---------Después de insertar o editar, se vuelve a hacer un GET y se actualiza cursosSubject con todos los cursos, incluyendo los cambios recientes, por eso es importante mandarle el id_curso para que lo agrege a la nueva lista y se muestre en la tabla------
      }, error: (err) => console.error('Error al listar cursos:', err)
    });
  }


  //-------Captura el curso y los coloca en los inputs los datos----
  editarCurso(curso: CursoInfoCursoResponseModels) {
    this.editandoId = curso.id_curso;

    this.formulario.reset(); // Limpia completamente el formulario, si en caso doy click a otra fila editar , limpia el formulario anterior

    setTimeout(() => { //El setTimeOut retrasa la ejecucion del codigo hasta que angular haya terminado de procesar el ciclo actual de cambios
      this.formulario.patchValue({
        nombre: curso.nombre,
        id_carrera: curso.id_carrera,
        ciclo: curso.ciclo,
        horaSemanal: curso.horaSemanal,
        credito: curso.credito,
        tipo: curso.tipo
      });
    }, 0);

  }


  guardarCurso(): void {

    if (this.formulario.invalid) {
      if (this.formulario.invalid) {
        this.formulario.markAllAsTouched(); // <-- importante para mostrar errores de los inputs
        return;
      }
    }

    const data: CursoInfoCursoModels = this.formulario.value;

    if (this.editandoId != null) {
      // Modo edición
      this.serv.editar(this.editandoId, data).subscribe({
        next: () => {
          this.resetFormulario();
          this.listarCursoInfoCurso();
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
      this.serv.insertar(data).subscribe({
        next: () => {
          this.resetFormulario();
          this.listarCursoInfoCurso();
        },
        error: (err) => {
          console.error("Error al guardar el curso", err);
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


  eliminarCurso(id_curso: number) {
    if (confirm('¿Estas seguro que deseas eliminar este curso?')) {
      this.serv.eliminar(id_curso).subscribe({
        next: () => {
          //Obtiene todo el array completo de cursos hasta ese momento
          const actual = this.cursosSubject.value;
          //Se crea un nuevo array excluyendo el curso cuyo id_curso coincide con el que se quiere eliminar.
          //filter() recorre el array y devuelve todos los cursos excepto el que tenga ese id_curso.
          //Así se "elimina" visualmente ese curso en la vista.
          const actualizado = actual.filter(curso => curso.id_curso !== id_curso);
          this.cursosSubject.next(actualizado);
        },
        error: (err) => {
          console.log('Error al eliminar un curso:', err);
        }
      });
    }
  }



  idCarreraSeleccionada: string = ''; // ngModel la llenara como string

  filtrarCursoPorCarrera(): void {
    const id = Number(this.idCarreraSeleccionada);

    if (!id) {
      this.listarCursoInfoCurso(); // Si el valor es vacío, listar todos
      return;
    }

    this.serv.filtrarPorCarrera(id).subscribe({
      next: (data) => {
        this.cursosSubject.next(data);
      },
      error: (err) => {
        console.error('Error al filtrar cursos por carrera:', err);
      }
    });
  }


}
