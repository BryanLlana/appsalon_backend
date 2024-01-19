import { Router } from "express";
import { AppointmentController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { AppointmentService } from "../services";

export class AppointmentRoutes {
  static get routes(): Router {
    const router = Router()
    const appointmentService = new AppointmentService()
    const controller = new AppointmentController(appointmentService)

    router.post('/', AuthMiddleware.validateJwt ,controller.createAppointment)
    router.get('/', AuthMiddleware.validateJwt, controller.getAppointmentsByDate)
    router.get('/:id', AuthMiddleware.validateJwt, controller.getAppointmentById)
    router.put('/:id', AuthMiddleware.validateJwt, controller.updateAppointment)
    router.delete('/:id', AuthMiddleware.validateJwt, controller.deleteAppointment)

    return router
  }
}