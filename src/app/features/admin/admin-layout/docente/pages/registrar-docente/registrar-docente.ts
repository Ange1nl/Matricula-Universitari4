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
  private fb = inject(FormBuilder);

  selectedFile: File | null = null;

  formDocente = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    carrera: ['', Validators.required],
    nivelEstudio: ['', Validators.required],
    img: ['', Validators.required]
  });


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  registrarDocente() {

    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // 1. Subir imagen
    this.serv.subirImagen(formData).subscribe({
      next: (fileName: string) => {
        // 2. Construir objeto docente con el nombre del archivo
        const datosDocente = {
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
