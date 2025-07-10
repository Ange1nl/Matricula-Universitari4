import { Curso } from "../../carrera/models/curso";
import { Docente } from "../../docente/models/docente";

export interface SeccionesModels {
    idSeccion:number,
    curso:Curso,
    horario:string,
    aula: string,
    profesores:Docente,
    cupos:number

}
