import { Request, Response } from "express"
import { CustomError } from "../../domain/errors"
import { UserService } from "../services"

export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error ' })
  }

  public getAppointmentsOfUser = (req: Request, res: Response) => {
    this.userService.getAppointmentsOfUser(req.params.user, req.body.user.id.toString(), req.body.user.admin)
      .then(appointments => res.status(200).json(appointments))
      .catch(error => this.handleError(error, res))
  }
}