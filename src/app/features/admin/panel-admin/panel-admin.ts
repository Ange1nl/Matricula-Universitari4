import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-panel-admin',
  imports: [RouterLink],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdmin {

  private auth = inject(AuthService);

  //PARA CERRAR SESION
  logout() {
    this.auth.cerrarSesion();
  }

}
