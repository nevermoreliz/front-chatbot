
export class Usuario {

    constructor(
        public nombre_usuario: string,
        public contrasenia?: string,
        public id_usuario?: number,
        public id_persona?: number,
        public estado?: boolean,
        public roles?: Array<string>
    ) { }

}
