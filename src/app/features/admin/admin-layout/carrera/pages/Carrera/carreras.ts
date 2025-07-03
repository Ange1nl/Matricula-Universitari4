import { Component, inject } from '@angular/core';
import { CarreraService } from '../../services/carrera.service';
import { Carrera } from '../../models/carrera';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carreras',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './carreras.html',
  styleUrl: './carreras.css'
})
export class Carreras {

  private serv = inject(CarreraService);
  private fb = inject(FormBuilder);

  carreras: Carrera[] = [];
  mostrarModal: boolean = false;
  carreraSeleccionada: Carrera = { id_carrera: 0, nombre_carrera: '' }; // Objeto que almacena temporalmente la carrera a editar

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
    this.serv.listar().subscribe(data => {
      this.carreras = data; //data es la respuesta del servidor  y lo guardamos en carreras que sera despues mostrado en el html
    });
  }

  agregarCarrera(): void {
    if (this.agregarForm.invalid) return;
    //Se crea un objeto carrera con los datos ingresados del formulario reactivo
    const nueva: Carrera = this.agregarForm.value;

    this.serv.insertar(nueva).subscribe(() => {
      this.agregarForm.reset();
      this.obtenerCarreras(); // Recarga la lista de carreras actualizada
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
      id_carrera: carrera.id_carrera,
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
