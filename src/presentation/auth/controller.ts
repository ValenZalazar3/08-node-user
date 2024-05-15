import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";



export class AuthController {

    // DI (Inyección de Dependencia)
    constructor(
        public readonly authService: AuthService // esto tenemos que instanciarlo, lo podríamos hacer aca pero para seguir la lógica con la que venimos, lo instancio en el routes.ts de esta misma carpeta.
    ) { }

    public handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(400).json({ error: error.message })
        }
        console.log(`${error}`)
        res.status(500).json({ error: 'internal server error' })
    }


    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body)
        if (error) return res.status(400).json({ error })


        this.authService.registerUser(registerDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginDto] = LoginUserDto.create(req.body)
        if (error) return res.status(400).json({ error })


        this.authService.loginUser(loginDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res))
    }
    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;

        this.authService.validateEmail(token)
            .then(() => { res.json('Email validated') })
            .catch(error => this.handleError(error, res))
    }
}


