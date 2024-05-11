// El entity es justamente un filtro para el modelo de la base de datos, por lo que el user que nosotros vamos a crear va a ser el user.entity que va a ser una entidad de user. Nuestro Modelo. Lo que tiene como beneficio esto es que prevenimos un efecto de errores en cascada si pasase algo en nuestra base de datos, (que en este caso es mongo). Por otro lado tambien podemos hacer uso de diversas bases de datos sin tener que modificar todo nuestro codigo.


import { CustomError } from "../errors/custom.error";


export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { id, _id, name, email, emailValidated, password, role, img } = object;

        if (!id && !_id) {
            throw CustomError.badRequest('Missing id')
        }
        if (!name) throw CustomError.badRequest('Missing name')
        if (!email) throw CustomError.badRequest('Missing email')
        if (!password) throw CustomError.badRequest('Missing password')
        if (!role) throw CustomError.badRequest('Missing role')
        if (emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated')

        return new UserEntity(id || _id, name, email, emailValidated, password, role, img)
    }
}