import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-panel-recep',
  imports: [RouterLink],
  templateUrl: './panel-recep.html',
  styleUrl: './panel-recep.css'
})
export class PanelRecep {

  private auth = inject(AuthService);

  nombre: string | null = '';
  idUsuario: number | null = null;
  rol: string | null = '';


  mostrarDropdown = false;

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }
  
  ngOnInit() {
    this.nombre = this.auth.getNombre();
    this.idUsuario = this.auth.getIdUsuario();
    this.rol = this.auth.getRol();
  }


  //PARA CERRAR SESION
  logout() {
    this.auth.cerrarSesion();
  }



}
