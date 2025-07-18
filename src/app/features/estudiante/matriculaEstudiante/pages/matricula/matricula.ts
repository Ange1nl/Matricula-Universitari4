import { Component } from '@angular/core';
import { LoginResponse } from '../../../loginEstudiante/models/login-response';

@Component({
  selector: 'app-matricula',
  imports: [],
  templateUrl: './matricula.html',
  styleUrl: './matricula.css'
})
export class Matricula {

  data?: LoginResponse;

  ngOnInit() {
    const storedData = localStorage.getItem('loginData');//Traemos el localstorage que tiene los datos, cuando iniciamos sesion
    if (storedData) {
      this.data = JSON.parse(storedData);
    }
  }
}
