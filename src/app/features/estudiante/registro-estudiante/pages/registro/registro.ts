import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { RequestRegistroModel } from '../../models/request-registro-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  private serv = inject(RegistroService);
  private fb = inject(FormBuilder);


  registroForm: FormGroup = this.fb.group({
    codigo: [null, [Validators.required]],
    dni: [null, [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['ESTUDI']
  });


  crearCuenta(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const form = this.registroForm.value;

    //Objeto javascript con tipado de mi interfaz
    const request: RequestRegistroModel = {
      codigo_estudiante: +form.codigo,
      correo_estudiante: form.correo,
      password: form.password,
      rol: form.rol.toUpperCase(),
      estudiante_Universidad: {
        dni_estudiante: form.dni
      }
    };
    //Dato interesante si ya me registre y vuelvo a registrarme con mismo el dni_estudiante saldra error, porque en mi backend puse OneToOne es decir Unicidad  1 a 1
    this.serv.insertar(request).subscribe({
      
      next: () => {
        alert('Cuenta creada exitosamente');
        this.registroForm.reset();
      },
      error: () => {
          alert("Error al registrarse");         
        }
      });
    
  }


}
