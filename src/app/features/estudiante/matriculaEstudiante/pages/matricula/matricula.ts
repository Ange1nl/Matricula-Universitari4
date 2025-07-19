import { Component, inject } from '@angular/core';
import { LoginResponse } from '../../../loginEstudiante/models/login-response';
import { Seccion } from '../../models/seccion';
import { MatriculaService } from '../../services/matricula.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaResponse } from '../../models/matricula-response';
import { MatriculaResumenRow } from '../../models/matricula-resumen-row';

@Component({
  selector: 'app-matricula',
  imports: [CommonModule, FormsModule],
  templateUrl: './matricula.html',
  styleUrl: './matricula.css'
})
export class Matricula {

  private service = inject(MatriculaService);

  data?: LoginResponse;

  secciones: Seccion[] = [];

  // Datos del curso actualmente abierto (para mostrar sus secciones)
  cursoSeleccionadoNombre = '';
  cursoSeleccionadoId: number | null = null;

  // Acumulador de IDs de secciones que se enviarán al backend
  seccionesSeleccionadas: number[] = [];

  /**
   * Mapa de curso -> información de la sección elegida (para mostrar en tabla)
   * Sólo UNA sección por curso (lógica típica). .
   */
  seccionPorCurso: {
    [idCurso: number]: {
      idSeccion: number;
      horario: string
    }
  } = {};

  //PARA EL RESUMEN DE MATRICULA GET
  resumenMatricula: MatriculaResumenRow[] = [];

  mensaje = '';
  procesando = false;

  //Trae los datos del localStorage pero decidi que lo que se muestra en pantalla en la tabla solo sera el Curso y InfoCurso
  ngOnInit() {
    const stored = localStorage.getItem('loginData');
    if (stored) {
      this.data = JSON.parse(stored) as LoginResponse;
    }
  }

  //Selecciona el id del curso y se muestra las secciones en la tabla de abajo del html
  // Abrir secciones del curso
  verSecciones(idCurso: number, nombre: string) {
    this.cursoSeleccionadoId = idCurso;
    this.cursoSeleccionadoNombre = nombre;
    this.secciones = [];
    this.service.getSeccionesPorCurso(idCurso).subscribe({ //Busca las secciones de ese idCurso
      next: res => this.secciones = res,
      error: err => {
        console.error(err);
        this.mensajeTemporal('Error cargando secciones');
      }
    });
  }

  // Cerrar panel de secciones
  cerrarSecciones() {
    this.cursoSeleccionadoId = null;
    this.cursoSeleccionadoNombre = '';
    this.secciones = [];
  }


  /*Selecciona una sección: Quita la anterior si ya había para ese curso.Agrega el nuevo idSeccion al array global para enviar al backend. Guarda datos de aula en el mapa seccionPorCurso. Muestra mensaje y cierra panel de secciones.*/
  seleccionarSeccion(sec: Seccion) {
    const idCurso = sec.curso.id_curso;
    const idSeccion = sec.idSeccion;

    // Si ya había sección para ese curso, quitar su ID del arreglo global
    if (this.seccionPorCurso[idCurso]) {
      const anteriorId = this.seccionPorCurso[idCurso].idSeccion;
      this.seccionesSeleccionadas = this.seccionesSeleccionadas.filter(id => id !== anteriorId);
    }

    //Creacion un objeto javascript literal, para  Guardar nueva sección
    this.seccionPorCurso[idCurso] = {
      idSeccion: idSeccion,
      horario: sec.horario,
    };

    // Agregar a la lista final si no estaba
    if (!this.seccionesSeleccionadas.includes(idSeccion)) {
      this.seccionesSeleccionadas.push(idSeccion);
    }

    // Feedback y cerrar panel
    this.mensajeTemporal(`Sección ${idSeccion} (Aula ${sec.aula}) agregada`);
    this.cerrarSecciones();
  }



  // Quitar selección de un curso con el boton 
  quitarSeccionDeCurso(idCurso: number) {
    const info = this.seccionPorCurso[idCurso];  // aquí obtengo el objeto { idSeccion, aula }
    if (!info) return;
    this.seccionesSeleccionadas = this.seccionesSeleccionadas.filter(id => id !== info.idSeccion);
    delete this.seccionPorCurso[idCurso];
    this.mensajeTemporal(`Sección ${info.idSeccion} removida`);
  }

  cursoTieneSeccion(idCurso: number): boolean {
    return !!this.seccionPorCurso[idCurso];
  }


  procesarMatricula() {
    if (!this.data) {
      this.mensajeTemporal('Sin datos del estudiante');
      return;
    }
    if (this.seccionesSeleccionadas.length === 0) {
      this.mensajeTemporal('Selecciona al menos una sección');
      return;
    }

    const body = {
      codigo_estudiante: this.data.codigoEstudiante, //Captura el codigo estudiante
      id_secciones: this.seccionesSeleccionadas //Captura las secciones seleccinadas [12, 14, 15]
    };

    this.procesando = true;

    this.service.procesarMatricula(body).subscribe({
      next: (resp: MatriculaResponse[]) => {

        if (resp.length === 0) {
          this.mensajeTemporal('No se generaron matrículas (quizás ya estabas matriculado).');
          this.procesando = false;
          return;
        }

        // Mapa id_seccion -> id_matricula
        const mapMat = new Map<number, number>(
          resp.map(r => [r.id_seccion, r.id_matricula])
        );

        const ids = resp.map(r => r.id_seccion);

        // Traer detalles completos De la seccion
        this.service.getSeccionesByIds(ids).subscribe({
          next: (seccionesDetalle: Seccion[]) => {
            this.resumenMatricula = seccionesDetalle.map(sec => ({
              id_matricula: mapMat.get(sec.idSeccion)!,
              id_seccion: sec.idSeccion, //El primero es de mi record id_seccion y el segundo de la interfaz seccion
              curso: sec.curso,
              horario: sec.horario,
              aula: sec.aula,
              profesor: sec.profesores,
              modalidad: sec.modalidad
            }));

            // Persistir opcionalmente
            localStorage.setItem('resumenMatriculaFinal', JSON.stringify(this.resumenMatricula));

            this.mensajeTemporal(`Matrícula completa. Total: ${this.resumenMatricula.length}`);

            // Limpiar selección visual
            this.seccionPorCurso = {};
            this.seccionesSeleccionadas = [];
            this.cerrarSecciones();
          },
          error: err2 => {
            console.error(err2);
            this.mensajeTemporal('Matrícula creada, pero error trayendo detalle.');
          },
          complete: () => this.procesando = false
        });
      },
      error: err => {
        console.error(err);
        this.mensajeTemporal(err.error?.error || 'Error al procesar');
        this.procesando = false;
      }
    });
  }


  // Mensaje temporal
  private mensajeTemporal(txt: string, ms = 2500) {
    this.mensaje = txt;
    setTimeout(() => {
      if (this.mensaje === txt) this.mensaje = '';
    }, ms);
  }


}
