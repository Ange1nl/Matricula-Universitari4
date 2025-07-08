import { Curso } from "./curso";

export interface Infocurso {
    id_infoCurso?:number,
    horaSemanal:string,
    credito:number,
    tipo:string,
    curso:Curso

}
