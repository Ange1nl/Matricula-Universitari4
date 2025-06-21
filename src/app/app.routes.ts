import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [

    {path: 'inicio', component:Inicio, title: "Pagina principal"},

    {path: '**', component:NotFoundPage, title: "Pagina no encontrada"}



];
