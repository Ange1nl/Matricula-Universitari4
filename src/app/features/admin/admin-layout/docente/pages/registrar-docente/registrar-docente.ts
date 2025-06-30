import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Docente } from '../../models/docente';
import { DocenteService } from '../../services/docente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-docente',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './registrar-docente.html',
  styleUrl: './registrar-docente.css'
})
export class RegistrarDocente {

  protected docente$!: Observable<Docente[]>;
  private serv = inject(DocenteService);
  private fb = inject(FormBuilder); //Inyecto el FormBuilder para construir formularios reactivos

  selectedFile: File | null = null; //Esta variable guarda el archivo seleccionado por el usuario <input type="file">

  //Defino mi formulario con los campos requeridos que tendra
  formDocente = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    carrera: ['', Validators.required],
    nivelEstudio: ['', Validators.required],
    img: ['', Validators.required]
  });


  //Se ejecuta cuando el usuario selecciona la imagen y lo guarda en el selectedFile para usarlo en la subida
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  registrarDocente() {

    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData(); //Se crea un FormData que sera necesario para subir archivos multipart/form-data
    formData.append('image', this.selectedFile); //Agrega el archivo con el nombre 'image' que es el que espera mi controlador /api/imagen/upload-img en el backend (@RequestParam("image")).

    // 1. Subir imagen
    this.serv.subirImagen(formData).subscribe({ //Llama al backend  /api/imagen/upload-img para subir el archivo
      next: (fileName: string) => {
        // 2. Construir objeto docente con el nombre del archivo
        const datosDocente = { //Usa los valores del formulario con this.formDocente.value y le añade el nombre de la imagen img:fileName
          ...this.formDocente.value,
          img: fileName
        };

        // 3. Insertar docente
        this.serv.insertar(datosDocente).subscribe({
          next: () => {
            alert('Docente registrado exitosamente');
            this.formDocente.reset();
          },
          error: () => alert('Error al guardar el docente')
        });
      },
      error: () => alert('Error al subir la imagen')
    });
  }



  


}
