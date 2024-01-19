import { Router } from 'express'
import { ServiceController } from '../services-app'
import { ServiceService } from '../services'

export class ServiceRoutes {
  static get routes(): Router {
    const router = Router()
    const serviceService = new ServiceService()
    const controller = new ServiceController(serviceService)

    router.get('/', controller.getServices)
    router.post('/', controller.createService)
    router.get('/:id', controller.getService)
    router.put('/:id', controller.updateService)
    router.delete('/:id', controller.deleteService)

    return router
  }
}