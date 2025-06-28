import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Credenciales } from '../../auth/models/credenciales';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-admin-recep',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login-admin-recep.html',
  styleUrl: './login-admin-recep.css'
})
export class LoginAdminRecep {

  private fb = inject(FormBuilder);
  private service = inject(AuthService);
  private credenciales:Credenciales ={
    email:'', password:''
  }

  protected errorMsg = signal<string | null> (null); //para el manejo de errores
  
  //Formulario - Inicio (validacion de forma reactiva)
  public loginForm: FormGroup = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6)]]
  })

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }
  //Formulario - Fin


  loginFn(){
    //Si los datos no cumplen la validacion, se sale
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    //Refrezcar mensaje de error
    this.errorMsg.set(null);
    this.credenciales.email = this.loginForm.value.email;
    this.credenciales.password = this.loginForm.value.password;
    //Proceso de login
    this.service.iniciarSesion(this.credenciales).subscribe({
      next: (res) =>{ //En caso que todo este bien , credenciales , funcione nuestro metodo
        console.log("Token:",res.access_token, res.refresh_token);
      },
      error: (e)=>{
        this.errorMsg.set('Credenciales erroneas');
        console.warn(e.message);
      }
    })
  
  }


}
