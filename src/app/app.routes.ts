import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { InicioEstudiante } from './features/estudiante/inicio-estudiante/inicio-estudiante';

export const routes: Routes = [

    {path: 'inicio', component:Inicio, title: "Pagina principal"},
    {path: '',redirectTo:'inicio', pathMatch:'full'},//si esque esta vacio es decir localhost:4200 manda a inicio
    {path: 'inicioEstudiante',component:InicioEstudiante,title:"Login estudiante"},


    {path: '**', component:NotFoundPage, title: "Pagina no encontrada"}



];
