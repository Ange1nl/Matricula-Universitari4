import { Curso } from "../../carrera/models/curso";
import { Docente } from "../../docente/models/docente";

export interface SeccionesModels {
    idSeccion:number,
    curso:Curso, //Objeto completo
    horario:string,
    aula: string,
    profesores:Docente, //Objeto completo
    cupos:number
    modalidad: string;

}
