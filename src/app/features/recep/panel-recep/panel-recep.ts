import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-panel-recep',
  imports: [RouterLink],
  templateUrl: './panel-recep.html',
  styleUrl: './panel-recep.css'
})
export class PanelRecep {

  nombre: string | null = '';
  idUsuario: string | null = '';
  rol: string | null = '';

  private auth = inject(AuthService);

  mostrarDropdown = false;

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }
  
  ngOnInit() {
    this.nombre = localStorage.getItem('nombre');
    this.idUsuario = localStorage.getItem('idUsuario');
    this.rol = localStorage.getItem('rol');
  }


  //PARA CERRAR SESION
  logout() {
    this.auth.cerrarSesion();
  }



}
