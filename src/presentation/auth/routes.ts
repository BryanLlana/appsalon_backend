import { Router } from 'express'
import { AuthController } from '../auth'
import { AuthService, EmailService } from '../services'
import { envs } from '../../config'
import { AuthMiddleware } from '../middlewares'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()
    const emailService = new EmailService({
      mailerService: envs.MAILER_SERVICE,
      mailerEmail: envs.MAILER_EMAIL,
      mailerSecretKey: envs.MAILER_SECRET_KEY
    })
    const authService = new AuthService(emailService)
    const controller = new AuthController(authService)

    router.post('/register', controller.register)
    router.get('/verify/:token', controller.verifyAccount)
    router.post('/login', controller.login)
    router.post('/forgot-password', controller.forgotPassword)
    router.get('/forgot-password/:token', controller.verifyPasswordResetToken)
    router.post('/forgot-password/:token', controller.updatePassword)

    router.get('/user', AuthMiddleware.validateJwt, controller.getUser)

    return router
  }
}