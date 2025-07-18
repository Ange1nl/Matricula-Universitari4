export interface CursoConInfo {
  //Interfaz personalisada donde se mostrara atributos del curso como del infoCurso que mando mi backend
  //Curso
  idCurso: number;
  nombre: string;
  ciclo: number;
  //infoCurso
  horaSemanal: string | null;
  credito: number | null;
  tipo: string | null;
}
