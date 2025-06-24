import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { SesionEstudiante } from "./features/estudiante/sesion-estudiante/sesion-estudiante";
import { RegistrarIngresado } from "./features/recep/registrar-ingresado/registrar-ingresado";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Frontend-MatriculaUniversitaria';
}
