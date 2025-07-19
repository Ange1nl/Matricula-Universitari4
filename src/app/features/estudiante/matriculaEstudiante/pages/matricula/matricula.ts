import { Component, inject } from '@angular/core';
import { LoginResponse } from '../../../loginEstudiante/models/login-response';
import { Seccion } from '../../models/seccion';
import { MatriculaService } from '../../services/matricula.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaResponse } from '../../models/matricula-response';
import { MatriculaResumenRow } from '../../models/matricula-resumen-row';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-matricula',
  imports: [CommonModule, FormsModule,RouterLink],
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

 
  seccionPorCurso: Record<number, { idSeccion: number; horario: string }> = {};


  //PARA EL RESUMEN DE MATRICULA GET
  resumenMatricula: MatriculaResumenRow[] = [];

  mensaje = '';
  procesando = false;

  //----------------------------Trae los datos del localStorage pero decidi que lo que se muestra en pantalla en la tabla solo sera el Curso y InfoCurso------------------
  ngOnInit() {
    const stored = localStorage.getItem('loginData');
    if (stored) {
      this.data = JSON.parse(stored) as LoginResponse;
    }

    // ACA AGREGUE: cargar resumen previo si existe en localStorage, PARA LE GET , QUE SE MUESTRE TODAS LAS SECCIONES MATRICULAS POR MAS QUE RECARGE LA PAGINA
    const resumenGuardado = localStorage.getItem('resumenMatriculaFinal');
    if (resumenGuardado) {
      try {
        const arr = JSON.parse(resumenGuardado) as MatriculaResumenRow[];
        if (Array.isArray(arr)) {
          this.resumenMatricula = arr;
        }
      } catch (e) {
        console.warn('No se pudo parsear resumenMatriculaFinal desde localStorage', e);
      }
    }
  }


  //---------------------Selecciona el id del curso y se muestra las secciones en la tabla de abajo del html---------------------
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

  /*-----------------------Procesar matricula-----------------------*/
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
        const mapMat = new Map<number, number>(resp.map(r => [r.id_seccion, r.id_matricula]));
        const ids = resp.map(r => r.id_seccion);

        // Traer detalles completos de la(s) sección(es)
        this.service.getSeccionesByIds(ids).subscribe({
          next: (seccionesDetalle: Seccion[]) => {
            const nuevos: MatriculaResumenRow[] = seccionesDetalle.map(sec => ({
              id_matricula: mapMat.get(sec.idSeccion)!,
              id_seccion: sec.idSeccion,
              curso: sec.curso,
              horario: sec.horario,
              aula: sec.aula,
              profesor: sec.profesores,
              modalidad: sec.modalidad
            }));

            // ACA ELIMINE: asignación directa = seccionesDetalle.map(...)
            // ACA AGREGUE: fusión con datos previos
            this.mergeResumenMatricula(nuevos); // <--- IMPORTANTE

            // Persistir opcionalmente (actualizado)
            localStorage.setItem('resumenMatriculaFinal', JSON.stringify(this.resumenMatricula)); // ACA AGREGUE persistencia tras fusión

            this.mensajeTemporal(`Matrícula actualizada. Total: ${this.resumenMatricula.length}`);

            // Limpiar selección visual (esto SÍ se mantiene)
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



  // -------------------------------------------------------------
  // FUSIONAR RESUMENES (actualiza o inserta sin duplicados)
  // -------------------------------------------------------------
  private mergeResumenMatricula(nuevos: MatriculaResumenRow[]) {
    // ACA AGREGUE: lógica de fusión usando Map
    // Clave: id_seccion (puedes cambiar a id_matricula si prefieres)
    const map = new Map<number, MatriculaResumenRow>();

    // Primero: datos existentes
    for (const r of this.resumenMatricula) {
      map.set(r.id_seccion, r);
    }

    // Luego: sobrescribir / agregar con los nuevos
    for (const n of nuevos) {
      map.set(n.id_seccion, n); // reemplaza si existe, inserta si no
    }

    // Reconstruir array (mantiene orden aproximado: existentes + nuevos)
    const existentesIds = this.resumenMatricula.map(r => r.id_seccion);
    const nuevosIds = nuevos.map(n => n.id_seccion);
    const orden = [...existentesIds.filter(id => map.has(id)), ...nuevosIds.filter(id => !existentesIds.includes(id))];
    this.resumenMatricula = orden.map(id => map.get(id)!);
  }



  // Mensaje temporal
  private mensajeTemporal(txt: string, ms = 2500) {
    this.mensaje = txt;
    setTimeout(() => {
      if (this.mensaje === txt) this.mensaje = '';
    }, ms);
  }


}
