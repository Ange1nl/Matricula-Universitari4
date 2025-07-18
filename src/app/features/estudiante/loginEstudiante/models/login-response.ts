import { CursoConInfo } from "./curso-con-info";
//Esta interfaz es el record de mi backend  EstudianteLoginResponse , cuando inicio sesion y entro a matricula
export interface LoginResponse {
  codigoEstudiante: number;
  carreraId: number;
  carreraNombre: string;
  periodoActual: number;
  periodoMatricula: number;
  cursos: CursoConInfo[];
}
