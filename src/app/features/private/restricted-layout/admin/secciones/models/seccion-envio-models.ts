export interface SeccionEnvioModels {
    //PARA EL ENVIO(POST) USAREMOS ESTA INTERFAZ Y PARA GET LA OTRA
    curso: { id_curso: number };
    horario: string;
    aula: string;
    profesores: { id_profesor: number };
    cupos: number;
    modalidad: string;
}
