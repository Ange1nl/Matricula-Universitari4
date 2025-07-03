export interface Docente {
    id_profesor?:number, //Opcional para que no sea requerido al crear un nuevo docente
    nombre:string,
    apellido:string,
    correo:string,
    telefono:string,
    profesion:string,
    nivel_estudio:string,
    img:string
}
