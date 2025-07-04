import { Component, inject } from '@angular/core';
import { CarreraService } from '../../services/carrera.service';
import { Carrera } from '../../models/carrera';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-carreras',
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe,RouterLink],
  templateUrl: './carreras.html',
  styleUrl: './carreras.css'
})
export class Carreras {

  protected carrera$!: Observable<Carrera[]>;//Para el get
  private serv = inject(CarreraService);
  private fb = inject(FormBuilder);

  //carreras: Carrera[] = [];
  mostrarModal: boolean = false;

  //Formulario reactivo para agregar una carrera
  agregarForm: FormGroup = this.fb.group({
    nombre_carrera: ['', Validators.required]
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

  /*-------PARA GUARDAR------*/
  agregarCarrera(): void {
    if (this.agregarForm.invalid) return;
    //Se crea una objeto nueva que guardara los datos del formularios reactivo y le digo que el objeto debe seguir la estructura de la interfaz Carrera es decir el objeto es de tipo Carrera
    const nueva: Carrera = this.agregarForm.value;

    this.serv.insertar(nueva).subscribe({

      next: () => {
        this.agregarForm.reset();
        this.obtenerCarreras(); // Recarga la lista de carreras actualizada
      },

      error: (err) => { // este bloque se ejecuta si el backend responde con error
        // Verifica si el error es de validación del backend (código HTTP 400 - Bad Request) "MANDA ERROR 400 POR LAS VALIDACIONES Y ESA PARTE SE EJECUTA"
        if (err.status === 400 && err.error) { //El err.error te manda el JSON ,es decir lo que recibe en Angular es exactamente el mismo objeto que construyes en el backend
          const errores = err.error; // guarda el objeto JSON del backend en la constante errores { nombre: "No puede contener números" , telefono: "El telefono debe tener 9 digitos" }
          //Este bucle recorre cada clave json  como nombre_carrera, ciclo, descripcion etc
          for (const campo in errores) {
            // Busca el control (input) correspondiente en el formulario
            const control = this.agregarForm.get(campo);// ejemplo: agregarForm.get('nombre_carrera') , Intenta buscar un campo con ese nombre en el formulario reactivo, "ES DECIR CAPTURA LO DEL FORMULARIO REACTIVO AVER SI COINCIDE CON EL CAMPO"
            //el control es una referencia al FormControl del campo "nombre_carrera" en el formulario
            if (control) { // Verifica que el campo exista en el formulario
              control.setErrors({ backend: errores[campo] }); //al hacer esto errores[nombre_carrera] , estoy accediendo a "no puede contener numeros"
              //"backend" es la clave personalizada del error ,backend , es no puede contener numeros por ejemplo
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

  /*-------PARA EDITAR-------*/
  guardarCambios(): void {
    if (this.editarForm.invalid) return;

    // Extrae los datos del formulario de edición
    //SIMILIAR A GUARDAR , Se crea una objeto nueva que guardara los datos del formularios reactivo y le digo que el objeto debe seguir la estructura de la interfaz Carrera es decir el objeto es de tipo Carrera
    const datos: Carrera = this.editarForm.value;

    this.serv.editar(datos.id_carrera!, datos).subscribe({
      next: () => {
        this.cerrarModal();
        this.obtenerCarreras();
      },
      error: (err) => {
        // Verifica si es error 400 con errores del backend
        if (err.status === 400 && err.error) {
          const errores = err.error; // JSON: { nombre_carrera: "Mensaje de error..." }

          for (const campo in errores) {
            const control = this.editarForm.get(campo); // Busca el campo correspondiente en el formulario
            if (control) {
              control.setErrors({ backend: errores[campo] }); // Asigna el mensaje como error personalizado
            }
          }
        }
      }

    });
  }


}
