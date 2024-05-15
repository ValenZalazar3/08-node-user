import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";





export class AuthService {

    constructor(
        private readonly emailService: EmailService,
    ) { }

    // si tuviera que trabajar con arquitectura limpia en su totalidad el registerUser tiene que ser un caso de uso
    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if (existUser) throw CustomError.badRequest('Email already exist')
        try {

            const user = new UserModel(registerUserDto) // con esto se crea el usuario y luego lo guardaríamos en la BD

            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save()

            if (!user.email) return // esta es una validacion que me pide. A fernando no se la pide. En vez de mandarle el ! para forzarlo lo hice así
            await this.sendEmailValidationLink(user.email)


            const { password, ...userEntity } = UserEntity.fromObject(user)
            const token = await JwtAdapter.generateToken({ id: user.id })
            if (!token) throw CustomError.internalServer('Erro while creating JWT')

            return {
                user: userEntity,
                token: token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }




    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email })
        if (!user) throw CustomError.badRequest('Email not exist')

        const isMaching = bcryptAdapter.compare(loginUserDto.password, user.password!)
        if (!isMaching) throw CustomError.badRequest('Password is not valid')

        const { password, ...userEntity } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({ id: user.id })
        if (!token) throw CustomError.internalServer('Erro while creating JWT')

        return {
            user: userEntity,
            token: token
        }

    }


    private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer('Erro getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <h1> Validate your Email<h1>
        <p> Click on the following link to validate your email<p>
        <a href='${link}'> Validate your email: ${email}<a>
        `;


        const options = {
            to: email,
            subject: 'Validate you Email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options)

        if (!isSent) throw CustomError.internalServer('Error sending email')

        return true

    }


    public validateEmail = async (token: string) => {
        const payload = await JwtAdapter.validateToken(token)
        if (!payload) throw CustomError.unauthorized('Invalid Token')

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Email not in token')

        const user = await UserModel.findOne({ email })
        if (!user) throw CustomError.internalServer('Emial not exist');


        user.emailValidated = true;

        await user.save();

        return true

    }


}


