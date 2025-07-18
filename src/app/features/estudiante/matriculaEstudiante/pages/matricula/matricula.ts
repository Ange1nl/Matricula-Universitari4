import { Component, inject } from '@angular/core';
import { LoginResponse } from '../../../loginEstudiante/models/login-response';
import { Seccion } from '../../models/seccion';
import { MatriculaService } from '../../services/matricula.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-matricula',
  imports: [CommonModule,FormsModule],
  templateUrl: './matricula.html',
  styleUrl: './matricula.css'
})
export class Matricula {

  private service = inject(MatriculaService);

  //la data viene de LoginResponse
  data?: LoginResponse;

  secciones: Seccion[] = [];
  cursoSeleccionado: string = '';

  ngOnInit() {
    const storedData = localStorage.getItem('loginData');//Traemos el localstorage que tiene los datos, cuando iniciamos sesion
    if (storedData) {
      this.data = JSON.parse(storedData);
    }
  }

  verSecciones(cursoId: number, nombreCurso: string) {
    this.cursoSeleccionado = nombreCurso;

    this.service.getSeccionesPorCurso(cursoId).subscribe({
      next: (res) => {
        this.secciones = res;
      },
      error: (err) => console.error('Error cargando secciones:', err)
    });
  }


  cerrarSecciones() {
    this.secciones = [];
    this.cursoSeleccionado = '';
  }

}
