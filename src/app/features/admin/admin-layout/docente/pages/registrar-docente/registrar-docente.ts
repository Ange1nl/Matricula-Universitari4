import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Docente } from '../../models/docente';
import { DocenteService } from '../../services/docente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-docente',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-docente.html',
  styleUrl: './registrar-docente.css'
})
export class RegistrarDocente {

  private router = inject(Router); //Esto sera para cuando termine de registrar al docente me mande a /admin/docente/listar

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
    profesion: ['', Validators.required],
    nivel_estudio: ['', Validators.required],
    img: ['', Validators.required]
  });


  //Se ejecuta cuando el usuario selecciona la imagen y lo guarda en el selectedFile para usarlo en la subida
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  registrarDocente() {

    if (this.formDocente.invalid) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }



    const formData = new FormData(); //Se crea un FormData que sera necesario para subir archivos multipart/form-data
    formData.append('image', this.selectedFile); //Agrega el archivo con el nombre 'image' que es el que espera mi controlador /api/imagen/upload-img en el backend (@RequestParam("image")).

    // 1. Subir imagen
    this.serv.subirImagen(formData).subscribe({ //Llama al backend  /api/imagen/upload-img para subir el archivo
      next: (fileName: string) => { //fileName contiene ese nombre unico generado de la imagen "f3c9a77a-e2c2-4fd5-826b-d7c2a4573f3f_mifoto.jpg" , OJO fileName puede cambiar a cualquier otro nombre, lo que hace es almacenar el nombre de la imagen nomas         
        const {
          nombre,
          apellido,
          correo,
          telefono,
          profesion,
          nivel_estudio
        }  = this.formDocente.value;      
        
        //osea aca lo que esta haciendo es insertar los datos del formulario al objeto docente y el objeto docente tiene los mismos nombres de la interfaz docente
        const datosDocente: Docente = { //Objeto literal de tipo docente usando los datos del formulario
          nombre: nombre || '',
          apellido: apellido || '',
          correo: correo || '',
          telefono: telefono || '',
          profesion: profesion || '',
          nivel_estudio: nivel_estudio || '',
          img: fileName //El fileName capturado lo agrego al atributo img
        };

        // 3. Insertar docente
        this.serv.insertar(datosDocente).subscribe({
          next: () => {
            alert('Docente registrado exitosamente');
            this.formDocente.reset();
            this.router.navigate(['/admin/docente/listar']); // ← Redirección
          },
          error: () => alert('Error al guardar el docente')
        });
      },
      error: () => alert('Error al subir la imagen')
    });
  }






}
