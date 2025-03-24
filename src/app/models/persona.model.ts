
export class Persona {

    constructor(
        public nombre: string,
        public paterno: string,
        public materno: string,
        public ci: string,
        public fecha_nacimiento: Date,
        public img?: string,
        public correo_electronico?: string,
        public sexo?: string,
        public estado?: boolean,
        public id_persona?: number,
        public updated_at?: Date,
        public created_at?: Date,
    ) { }

}