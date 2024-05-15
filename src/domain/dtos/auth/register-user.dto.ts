// Los DTOs se utilizan comúnmente en arquitecturas de software que siguen el principio de separación de preocupaciones, donde diferentes capas de la aplicación tienen responsabilidades específicas y están separadas entre sí. Por ejemplo, en una arquitectura de tres capas típica (interfaz de usuario, lógica de negocio y capa de acceso a datos), los DTOs pueden utilizarse para transferir datos entre estas capas de manera eficiente y sin acoplarlas demasiado.

import { regularExps } from "../../../config";




export class RegisterUserDto {

    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ) { }


    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, email, password } = object;

        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password is too short'];

        return [undefined, new RegisterUserDto(name, email, password)]
    }
}



