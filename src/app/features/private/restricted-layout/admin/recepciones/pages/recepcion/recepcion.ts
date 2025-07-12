import { Component, inject } from '@angular/core';
import { RecepcionService } from '../../services/recepcion.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RecepcionModels } from '../../models/recepcion-models';

@Component({
  selector: 'app-recepcion',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recepcion.html',
  styleUrl: './recepcion.css'
})
export class Recepcion {

  private router = inject(Router);
  private serv = inject(RecepcionService);
  private fb = inject(FormBuilder);

  formulario!: FormGroup;


  ngOnInit() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrar(): void {
    if (this.formulario.valid) {

      const form = this.formulario.value;

      const recepcionEnvio: RecepcionModels = {
        firstname: form.nombre,
        lastname: form.apellido,
        email: form.correo,
        telefono: form.telefono,
        password: form.password
      };

      this.serv.insertar(recepcionEnvio).subscribe({
        next:() =>{
          this.formulario.reset();
          alert("Recepcionista registrado exitosamente");
          this.router.navigate(['/restringido/recepcionistas']);
        },
        error:(err) =>{
          console.error("Error al registrar:", err);
        }
      });

    }

  }



}
