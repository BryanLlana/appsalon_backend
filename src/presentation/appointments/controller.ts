import { Request, Response } from "express"
import { CustomError } from "../../domain/errors"
import { AppointmentDto } from "../../domain/dtos"
import { AppointmentService } from "../services"

export class AppointmentController {
  constructor (
    private readonly appointmentService: AppointmentService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error ' })
  }

  public createAppointment = (req: Request, res: Response) => {
    const [errors, appointmentDto] = AppointmentDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.appointmentService.createAppointment(appointmentDto!)
      .then(appointment => res.status(200).json(appointment))
      .catch(error => this.handleError(error, res))
  }

  public getAppointmentsByDate = (req: Request, res: Response) => {
    this.appointmentService.getAppointmentsByDate(req.query.date as string)
      .then(appointments => res.status(200).json(appointments))
      .catch(error => this.handleError(error, res))
  } 

  public getAppointmentById = (req: Request, res: Response) => {
    this.appointmentService.getAppointmentById(req.params.id, req.body.user.id.toString())
      .then(appointment => res.status(200).json(appointment))
      .catch(error => this.handleError(error, res))
  }

  public updateAppointment = (req: Request, res: Response) => {
    const [errors, appointmentDto] = AppointmentDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.appointmentService.updateAppointment(req.params.id, appointmentDto!)
      .then(appointment => res.status(200).json(appointment))
      .catch(error => this.handleError(error, res))
  }

  public deleteAppointment = (req: Request, res: Response) => {
    this.appointmentService.deleteAppoinment(req.params.id, req.body.user.id.toString())
      .then(appointment => res.status(200).json(appointment))
      .catch(error => this.handleError(error, res))
  }
}