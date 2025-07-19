import { Curso } from "./curso";
import { Profesores } from "./profesores";

export interface MatriculaResumenRow {
  id_matricula: number;
  id_seccion: number;
  curso: Curso;
  horario: string;
  aula: string;
  profesor: Profesores;
  modalidad: string;
}
