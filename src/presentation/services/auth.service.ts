import { envs } from '../../config'
import { BcryptAdapter, JwtAdapter } from '../../config/adapter'
import { userModel } from '../../data/mongo/models/user.model'
import { AuthLoginDto, AuthRegisterDto, ForgotPasswordDto } from '../../domain/dtos'
import { UserEntity } from '../../domain/entities'
import { CustomError } from '../../domain/errors'
import { getTokenValidate } from '../../helpers'
import { EmailService } from '../services'
import { UpdatePasswordDto } from '../../domain/dtos/auth/auth-update-password.dto';

export class AuthService {
  constructor(
    private readonly emailService: EmailService
  ) { }

  public async register(authRegisterDto: AuthRegisterDto) {
    const userExists = await userModel.findOne({ email: authRegisterDto.email })
    if (userExists) throw CustomError.badRequest('Usuario ya registrado')

    try {
      const user = new userModel({
        ...authRegisterDto,
        token: getTokenValidate()
      })
      user.password = BcryptAdapter.hash(authRegisterDto.password)
      await user.save()
      const userEntity = UserEntity.fromObject(user)

      //* Enviar email
      this.sendEmailValidationLink(userEntity)

      return {
        msg: 'El usuario se registró correctamente, revisa tu email',
        user: userEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  public async verifyAccount (token: string) {
    const userExists = await userModel.findOne({ token })
    if (!userExists) throw CustomError.unauthorized('Token no válido')

    try {
      userExists!.verified = true
      userExists!.token = ''
      await userExists!.save()

      return {
        msg: 'Usuario confirmado correctamente'
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  public async login (authLoginDto: AuthLoginDto) {
    const userExists = await userModel.findOne({ email: authLoginDto.email })
    if (!userExists) throw CustomError.notFound('Usuario inexistente')
    if (!userExists.verified) throw CustomError.unauthorized('Usuario no confirmado')
    const isValidPassword = BcryptAdapter.compare(authLoginDto.password, userExists.password)
    if (!isValidPassword) throw CustomError.badRequest('Password incorrecto')

    const userEntity = UserEntity.fromObject(userExists)

    //* Generar token
    const token = await JwtAdapter.generateToken({ id: userEntity.id })
    if (!token) throw CustomError.internalServer('Error al crear el jwt')

    return {
      user: userEntity,
      token
    }
  }

  public async forgotPassword (forgotPasswordDto: ForgotPasswordDto) {
    const user = await userModel.findOne({ email: forgotPasswordDto.email })
    if (!user) throw CustomError.notFound('Usuario inexistente')

    try {
      user.token = getTokenValidate()
      await user.save()
      const userEntity = UserEntity.fromObject(user)

      this.sendEmailForgotPassword(userEntity)

      return {
        msg: 'Hemos enviado un email con las instrucciones'
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`)
    }
  }

  public async verifyPasswordResetToken (token: string) {
    const userExists = await userModel.findOne({ token })
    if (!userExists) throw CustomError.unauthorized('Token no válido')

    return {
      msg: 'Token válido'
    }
  }

  public async updatePassword (updatePasswordDto: UpdatePasswordDto, token: string) {
    const userExists = await userModel.findOne({ token })
    if (!userExists) throw CustomError.unauthorized('Token no válido')

    try {
      userExists.token = ''
      userExists.password = BcryptAdapter.hash(updatePasswordDto.password)
      await userExists.save()
      return {
        msg: 'Password modificado correctamente'
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  private async sendEmailValidationLink (userEntity: UserEntity) {
    const link = `${envs.FRONTEND_URL}/auth/confirmar-cuenta/${userEntity.token}`
    const html = `
      <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin-bottom: 10px;">
        Hola: ${userEntity.name}, confirma tu cuenta en AppSalon
      </p>
    
      <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-bottom: 10px;">
        Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace
      </p>
      
      <a href='${link}' style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; margin-bottom: 15px; border-radius: 5px;">
        Confirmar Cuenta
      </a>
      
      <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555;">
        Si tu no creaste esta cuenta, puedes ignorar este mensaje
      </p>
    `

    const isSent = await this.emailService.sendEmail({
      to: userEntity.email,
      subject: 'AppSalon - Confirma tu cuenta',
      htmlBody: html
    })

    if (!isSent) throw CustomError.internalServer('Error sending email')
  }

  private async sendEmailForgotPassword (userEntity: UserEntity) {
    const link = `${envs.FRONTEND_URL}/auth/olvide-password/${userEntity.token}`
    const html = `
      <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin-bottom: 10px;">
        Hola: ${userEntity.name}, has solicitado reestablecer tu password
      </p>
    
      <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-bottom: 10px;">
        Sigue el siguiente enlace para generar un nuevo password:
      </p>
      
      <a href='${link}' style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; margin-bottom: 15px; border-radius: 5px;">
        Reestablecer Password
      </a>
      
      <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555;">
        Si tu no solicitaste esto, puedes ignorar este mensaje
      </p>
    `

    const isSent = await this.emailService.sendEmail({
      to: userEntity.email,
      subject: 'AppSalon - Reestablecer tu password',
      htmlBody: html
    })

    if (!isSent) throw CustomError.internalServer('Error sending email')
  }
}