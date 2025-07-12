import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-panel-admin',
  imports: [RouterLink],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdmin {

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
