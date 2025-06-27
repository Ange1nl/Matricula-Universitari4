import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { SesionEstudiante } from './features/estudiante/sesion-estudiante/sesion-estudiante';
import { RegistroEstudiante } from './features/estudiante/registro-estudiante/registro-estudiante';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { PrivateLayout } from './layouts/private-layout/private-layout';
import { MatriculaEstudiante } from './features/estudiante/matricula-estudiante/matricula-estudiante';
import { LoginAdminRecep } from './features/login/login-admin-recep/login-admin-recep';

export const routes: Routes = [

    /* ESTO SE APLICA CUANDO NO HAY 2 O MAS HEADER O FOOTER ES DECIR SOLO TIENES 1 HEADER Y FOOTER
    {path: 'inicio', component:Inicio, title: "Pagina principal"},
    {path: '',redirectTo:'inicio', pathMatch:'full'},//si esque esta vacio es decir localhost:4200 manda a inicio
    {path: 'sesionEstudiante',component:SesionEstudiante,title:"Login estudiante"},
    {path: 'registroEstudiante', component:RegistroEstudiante, title:"Registro estudiante"},

    {path: '**', component:NotFoundPage, title: "Pagina no encontrada"}
    */


    {path: '',component: PublicLayout,
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },//si esque esta vacio es decir localhost:4200 manda a inicio
            { path: 'inicio', component: Inicio, title: "Página principal" },
            { path: 'sesionEstudiante', component: SesionEstudiante, title: "Login estudiante" },
            { path: 'registroEstudiante', component: RegistroEstudiante, title: "Registro estudiante" },

            {path: 'loginAdminRecep', component:LoginAdminRecep, title: "Login"},

        ]
    },


    {path: '',component: PrivateLayout,
        children: [
            { path: 'matricula', component: MatriculaEstudiante, title: "Matrícula" },
            //{ path: 'panel-admin', component: PanelAdmin, title: "Panel administrador" }
        ]
    },

  { path: '**', component: NotFoundPage, title: "Página no encontrada" },


    

];
