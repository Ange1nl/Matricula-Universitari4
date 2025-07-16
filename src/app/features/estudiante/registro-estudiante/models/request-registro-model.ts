export interface RequestRegistroModel {
    codigo_estudiante: number,
    correo_estudiante: string,
    password: string,
    estudiante_Universidad :{dni_estudiante: number},
    rol: string
}