import { Curso } from "./curso";
import { Profesores } from "./profesores";

export interface Seccion {
  idSeccion: number;
  curso: Curso;
  horario: string;
  aula: string;
  profesores: Profesores;
  cupos: number;
  modalidad: string;
}
