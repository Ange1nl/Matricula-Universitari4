import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { SesionEstudiante } from './features/estudiante/sesion-estudiante/sesion-estudiante';
import { RegistroEstudiante } from './features/estudiante/registro-estudiante/registro-estudiante';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { PrivateLayout } from './layouts/private-layout/private-layout';
import { MatriculaEstudiante } from './features/estudiante/matricula-estudiante/matricula-estudiante';
import { LoginAdminRecep } from './features/login/login-admin-recep/login-admin-recep';
import { PanelRecep } from './features/recep/panel-recep/panel-recep';
import { MostrarAlumnos } from './features/recep/mostrar-alumnos/mostrar-alumnos';
import { RegistrarIngresado } from './features/recep/registrar-ingresado/registrar-ingresado';
import { authGuard } from './core/guards/auth-guard';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { PanelAdmin } from './features/admin/admin-layout/panel-admin/panel-admin';
import { ListarDocente } from './features/admin/admin-layout/docente/pages/listar-docente/listar-docente';
import { RegistrarDocente } from './features/admin/admin-layout/docente/pages/registrar-docente/registrar-docente';
import { Carreras } from './features/admin/admin-layout/carrera/pages/Carrera/carreras';
import { CursoInfoCurso } from './features/admin/admin-layout/carrera/pages/curso-info-curso/curso-info-curso';
import { Seccion } from './features/admin/admin-layout/secciones/pages/seccion/seccion';

export const routes: Routes = [

    /* ESTO SE APLICA CUANDO NO HAY 2 O MAS HEADER O FOOTER ES DECIR SOLO TIENES 1 HEADER Y FOOTER
    {path: 'inicio', component:Inicio, title: "Pagina principal"},
    {path: '',redirectTo:'inicio', pathMatch:'full'},//si esque esta vacio es decir localhost:4200 manda a inicio
    {path: 'sesionEstudiante',component:SesionEstudiante,title:"Login estudiante"},
    {path: 'registroEstudiante', component:RegistroEstudiante, title:"Registro estudiante"},

    {path: '**', component:NotFoundPage, title: "Pagina no encontrada"}
    */

    //La carpeta Padre como esta vacio en el routerLink se puede poner el /nombreRuta pero si tiene un valor como el de admin que esta por la linea 56 , en el routerLink se pone sin el / porque anida la ruta padre con la hija

    {
        path: '', component: PublicLayout,
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },//coge esta ruta por defecto porque esta vacio ,esque esta vacio es decir localhost:4200 manda a inicio
            { path: 'inicio', component: Inicio, title: "Página principal" },
            { path: 'sesionEstudiante', component: SesionEstudiante, title: "Login estudiante" },
            { path: 'registroEstudiante', component: RegistroEstudiante, title: "Registro estudiante" },

            { path: 'loginAdminRecep', component: LoginAdminRecep, title: "Login" },            

        ]
    },


    {
        path: '', component: PrivateLayout,
        children: [

            {
                path: 'admin',component: AdminLayout,canActivate: [authGuard], //Creamos una carpeta padre
                children: [
                    { path: '', component: PanelAdmin,title: "Panel Admin" }, //Coge esta ruta por defecto porque esta vacio , admin PANEL ADMINISTRADOR
                    { path: 'docente/listar', component: ListarDocente, title: "Listar Docente"}, // /admin/docente/listar
                    { path: 'docente/registrar', component: RegistrarDocente, title: "Registrar Docente" }, // /admin/docente/registrar
                    { path: 'docente/registrar/:id', component: RegistrarDocente, title: "Editar Docente" },

                    {path: 'carrera', component: Carreras, title: "Carreras"},
                    {path: 'cursoInfoCurso', component: CursoInfoCurso, title: "Curso e Info Curso"},

                    {path: 'seccion', component: Seccion, title: "Secciones"},

                    {path: 'panelRecep', component: PanelRecep, title: "Panel Recep"},
                    { path: 'panelRecepcionista/mostrarAlumnos', component: MostrarAlumnos },
                    { path: 'panelRecepcionista/registrarIngresado', component: RegistrarIngresado }
                ]
            },

            { path: 'matricula', component: MatriculaEstudiante, title: "Matrícula" },
        ]
    },

    //Angular busca toda las rutas y cuando no encuentra ninguna ruta recien sale pagina no encontrada
    { path: '**', component: NotFoundPage, title: "Página no encontrada" },




];
