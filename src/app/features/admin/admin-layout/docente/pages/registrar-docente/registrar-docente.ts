import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Docente } from '../../models/docente';
import { DocenteService } from '../../services/docente.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registrar-docente',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './registrar-docente.html',
  styleUrl: './registrar-docente.css'
})
export class RegistrarDocente {

  private router = inject(Router); //Esto sera para cuando termine de registrar al docente me mande a /admin/docente/listar
  private route = inject(ActivatedRoute);// ActivatedRoute nos permite acceder al parámetro `id` si estamos editando
  protected docente$!: Observable<Docente[]>; //Si te das cuenta este observable docente$ no se usa y esque observables asi se usan mas para get encambio observables donde te suscribes se usan para algo mas complejo como post , put etc
  private serv = inject(DocenteService);
  private fb = inject(FormBuilder); //Inyecto el FormBuilder para construir formularios reactivos

  selectedFile: File | null = null; //Esta variable guarda el archivo seleccionado por el usuario <input type="file">
  idDocente: number | null = null; // Guarda el ID del docente a editar (si existe)

  //Defino mi formulario con los campos requeridos que tendra
  formDocente = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    profesion: ['', Validators.required],
    nivel_estudio: ['', Validators.required],
    img: ['']
  });

  ngOnInit() {
    // Captura el ID desde la URL, por ejemplo /admin/docente/registrar/5
    this.idDocente = Number(this.route.snapshot.paramMap.get('id'));

    // Si hay ID, estamos en modo edición → obtenemos los datos del docente
    if (this.idDocente) {
      this.serv.obtenerPorId(this.idDocente).subscribe(docente => {
        this.formDocente.patchValue(docente); // Precargamos el formulario con los datos del docente
      });
    }
  }


  //Se ejecuta cuando el usuario selecciona la imagen y lo guarda en el selectedFile para usarlo en la subida
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  registrarDocente() {

    if (this.formDocente.invalid) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    // Función interna para enviar los datos al servidor una vez que tengamos el nombre de la imagen
    const subirImagenYContinuar = (fileName: string) => {
      const {
        nombre,
        apellido,
        correo,
        telefono,
        profesion,
        nivel_estudio
      } = this.formDocente.value;

      // Creamos el objeto docente usando los valores del formulario
      const datosDocente: Docente = {
        nombre: nombre || '',
        apellido: apellido || '',
        correo: correo || '',
        telefono: telefono || '',
        profesion: profesion || '',
        nivel_estudio: nivel_estudio || '',
        img: fileName //El fileName capturado lo agrego al atributo img
      };

      //ACA ES COMO UNA CONDICION ELEGANTE donce this.idDocente es la condicion y el if es el ? y else es el :
      const accion = this.idDocente
        ? this.serv.editar(this.idDocente, datosDocente)  // Si hay ID → actualizar
        : this.serv.insertar(datosDocente); //Si no → insertar nuevo.

      // Ejecutamos la acción (insertar o editar)
      accion.subscribe({
        next: () => {
          alert(this.idDocente ? 'Docente actualizado exitosamente' : 'Docente registrado exitosamente');
          this.formDocente.reset(); // Limpiamos el formulario
          this.router.navigate(['/admin/docente/listar']); // Redirigimos al listado
        },
        error: () => alert('Error al guardar el docente')
      });
    };

    // Si el usuario seleccionó una imagen nueva, primero la subimos
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile); // Lo mismo que poner @RequestParam("image") en el backend

      this.serv.subirImagen(formData).subscribe({
        next: (fileName: string) => subirImagenYContinuar(fileName),
        error: () => alert('Error al subir la imagen')
      });

    } else {
      // Si NO seleccionó imagen nueva, usamos la imagen que ya tenía
      const imagenActual = this.formDocente.value.img || '';
      subirImagenYContinuar(imagenActual);
    }
  }


}
