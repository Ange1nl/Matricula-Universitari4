import { CursoConInfo } from "./curso-con-info";

export interface LoginResponse {
  codigoEstudiante: number;
  carreraId: number;
  carreraNombre: string;
  periodoActual: number;
  periodoMatricula: number;
  cursos: CursoConInfo[];
}
