import { Request, Response } from 'express'
import { CustomError } from '../../domain/errors'
import { ServiceService } from '../services'
import { ServiceDto } from '../../domain/dtos'

export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error ' })
  }

  public getServices = (req: Request, res: Response) => {
    this.serviceService.getServices()
      .then(services => res.status(200).json(services))
      .catch(error => this.handleError(error, res))
  }

  public createService = (req: Request, res: Response) => {
    const [errors, serviceDto] = ServiceDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.serviceService.createService(serviceDto!)
      .then(service => res.status(200).json(service))
      .catch(error => this.handleError(error, res))
  }

  public getService = (req: Request, res: Response) => {
    this.serviceService.getService(req.params.id)
      .then(service => res.status(200).json(service))
      .catch(error => this.handleError(error, res))
  }

  public updateService = (req: Request, res: Response) => {
    const [errors, serviceDto] = ServiceDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.serviceService.updateService(serviceDto!, req.params.id)
      .then(service => res.status(200).json(service))
      .catch(error => this.handleError(error, res))
  }

  public deleteService = (req: Request, res: Response) => {
    this.serviceService.deleteService(req.params.id)
      .then(service => res.status(200).json(service))
      .catch(error => this.handleError(error, res))
  }
}