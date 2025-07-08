import { Carrera } from "./carrera";

export interface Curso {
    id_curso?: number,
    nombre:string,
    ciclo:number,
    carrera:Carrera,
}
