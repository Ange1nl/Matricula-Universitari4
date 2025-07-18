import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-matricula',
  imports: [FormsModule],
  templateUrl: './login-matricula.html',
  styleUrl: './login-matricula.css'
})
export class LoginMatricula {

  private service = inject(LoginService);
  private router = inject(Router);

  codigo = '';
  password = '';
  errorMsg = '';

  onLogin() {
    const request: LoginRequest = {
      codigo: Number(this.codigo),
      password: this.password
    };

    this.service.login(request).subscribe({
      next: (resp: LoginResponse) => {
        // Guardar en localStorage para usar en la página de matrícula
        localStorage.setItem('loginData', JSON.stringify(resp));

        // Redirigir a la página de matrícula
        this.router.navigate(['/matricula']);
      },
      error: () => {
        this.errorMsg = 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }



}
