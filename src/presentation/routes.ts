import { Router } from 'express'
import { ServiceRoutes } from './services-app'
import { AuthRoutes } from './auth/routes'
import { AppointmentRoutes } from './appointments'
import { UserRoutes } from './users'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()

    //* ApiRest
    router.use('/api/services', ServiceRoutes.routes)
    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/appointments', AppointmentRoutes.routes)
    router.use('/api/users', UserRoutes.routes)

    return router
  }
}