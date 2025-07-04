import { Component, inject } from '@angular/core';
import { CarreraService } from '../../services/carrera.service';
import { Carrera } from '../../models/carrera';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-carreras',
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './carreras.html',
  styleUrl: './carreras.css'
})
export class Carreras {

  protected carrera$!: Observable<Carrera[]>;
  private serv = inject(CarreraService);
  private fb = inject(FormBuilder);

  //carreras: Carrera[] = [];
  mostrarModal: boolean = false;
  carreraSeleccionada: Carrera = { id_carrera: 0, nombre_carrera: '' }; // Objeto que almacena temporalmente la carrera a editar

  //Formulario reactivo para agregar una carrera
  agregarForm: FormGroup = this.fb.group({
    nombre_carrera: ['',Validators.required]
  });

  // Formulario reactivo para editar una carrera en modal
  editarForm: FormGroup = this.fb.group({
    id_carrera: [0], // ID oculto, necesario para saber cuál carrera editar
    nombre_carrera: ['', Validators.required]
  });


  //Ni bien se abre la pagina se ejecuta esto en la tabla
  ngOnInit() {
    this.obtenerCarreras();
  }


  obtenerCarreras(): void {
    this.carrera$ = this.serv.listar(); //Asignacion directa al observable
    /*
    this.serv.listar().subscribe(data => {
      this.carreras = data; //data es la respuesta del servidor  y lo guardamos en carreras que sera despues mostrado en el html , Suscripcion manual al observable
    });
    */
  }

  agregarCarrera(): void {
    if (this.agregarForm.invalid) return;
    //Se crea un objeto carrera con los datos ingresados del formulario reactivo
    const nueva: Carrera = this.agregarForm.value;

    this.serv.insertar(nueva).subscribe({

      next: () => {
        this.agregarForm.reset();
        this.obtenerCarreras(); // Recarga la lista de carreras actualizada
      },

      error: (err) => {
      // Verifica si el error es de validación del backend (código HTTP 400 - Bad Request)
      if (err.status === 400 && err.error) { //El err.error que recibes en Angular es exactamente el mismo objeto que construyes en el backend
        const errores = err.error; // Map<String, String> del backend ,  // { nombre_carrera: "No puede contener números" }
        for (const campo in errores) { //Recorre cada clave del JSON que envió el backend.
          // Busca el control (input) correspondiente en el formulario
          const control = this.agregarForm.get(campo);// ejemplo: agregarForm.get('nombre_carrera') , Intenta buscar un campo con ese nombre en el formulario reactivo
          if (control) { //Se asegura de que sí existe ese campo en el formulario 
            control.setErrors({ backend: errores[campo] }); 
            //"backend" es la clave personalizada del error ,backend , es no puede contener numeros por ejemplo
            //errores[campo] es el mensaje de error que envió el backend , campo es nombre_carrera
          }
        }
      }
      }
      
    });
  }


  eliminarCarrera(id: number): void {
    const confirmado = window.confirm('¿Estás seguro de eliminar esta carrera?');

    if (!confirmado) return;

    this.serv.eliminar(id).subscribe(() => {
      this.obtenerCarreras(); // Recarga la tabla si se eliminó
    });
  }


  // Abre el modal de edición y carga los datos de la carrera seleccionada
  abrirModal(carrera: Carrera): void {
    this.mostrarModal = true;

    // Se cargan los valores actuales de la carrera en el formulario de edición
    this.editarForm.setValue({
      id_carrera: carrera.id_carrera, //El primero id_carrera es lo del formulario, el segundo es lo que capturo y ese segundo que captura sera colocado en el formulario del modal de editar
      nombre_carrera: carrera.nombre_carrera
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.editarForm.reset();
  }


  guardarCambios(): void {
    if (this.editarForm.invalid) return;

    // Extrae los datos del formulario de edición
    const datos: Carrera = this.editarForm.value;

    this.serv.editar(datos.id_carrera!, datos).subscribe(() => {
      this.cerrarModal();
      this.obtenerCarreras();
    });
  }


}
