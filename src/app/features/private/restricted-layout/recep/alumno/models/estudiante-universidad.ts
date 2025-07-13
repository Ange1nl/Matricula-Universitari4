export interface EstudianteUniversidad {
    //El servidor responde con el id_usuario tambien pero para este caso , no pondremos ese campo , solo he puesto atributos para que se muestre  lo que es del alumno, basta que el backend y frotend tenga el mismo formato como JSON y no otro como string
    dni_estudiante:number;
    nombre:string;
    apellido:string;
    correo:string;
    carrera:string;
    telefono:string;
    fecha_registro:string;
}
