import { Request, Response } from "express";
import { AuthLoginDto, AuthRegisterDto, ForgotPasswordDto, UpdatePasswordDto } from "../../domain/dtos";
import { AuthService } from "../services";
import { CustomError } from "../../domain/errors";

export class AuthController {
  constructor (
    private readonly authService: AuthService
  ){}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error ' })
  }

  public register = (req: Request, res: Response) => {
    const [errors, authRegisterDto] = AuthRegisterDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.register(authRegisterDto!)
      .then(user => res.status(200).json(user))
      .catch(error => this.handleError(error, res))
  }

  public verifyAccount = (req: Request, res: Response) => {
    this.authService.verifyAccount(req.params.token)
      .then(user => res.status(200).json(user))
      .catch(error => this.handleError(error, res))
  }

  public login = (req: Request, res: Response) => {
    const [errors, authLoginDto] = AuthLoginDto.create(req.body)
    if (errors) return res.status(200).json({ errors })

    this.authService.login(authLoginDto!)
      .then(user => res.status(200).json(user))
      .catch(error => this.handleError(error, res))
  }

  public forgotPassword = (req: Request, res: Response) => {
    const [errors, forgotPasswordDto] = ForgotPasswordDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.forgotPassword(forgotPasswordDto!)
      .then(message => res.status(200).json(message))
      .catch(error => this.handleError(error, res))
  }

  public verifyPasswordResetToken = (req: Request, res: Response) => {
    this.authService.verifyPasswordResetToken(req.params.token)
      .then(message => res.status(200).json(message))
      .catch(error => this.handleError(error, res))
  }

  public updatePassword = (req: Request, res: Response) => {
    const [errors, updatePasswordDto] = UpdatePasswordDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.updatePassword(updatePasswordDto!, req.params.token)
      .then(message => res.status(200).json(message))
      .catch(error => this.handleError(error, res))
  }

  public getUser = (req: Request, res: Response) => {
    res.status(200).json({
      user: req.body.user
    })
  }
}