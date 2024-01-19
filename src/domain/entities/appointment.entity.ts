import { CustomError } from "../errors"

export class AppointmentEntity {
  constructor(
    public readonly id: string,
    public readonly services: string[],
    public readonly date: Date,
    public readonly time: string,
    public readonly totalAmount: number,
    public readonly user: string 
  ) {}

  static fromObject (object: {[key: string]: any}): AppointmentEntity {
    const { _id, services, date, time, totalAmount, user } = object
    if (!_id) throw CustomError.badRequest('Missing id')
    if (services.length === 0) throw CustomError.badRequest('Missing services')
    if (!date) throw CustomError.badRequest('Missing date')
    if (!time) throw CustomError.badRequest('Missing time')
    if (!totalAmount) throw CustomError.badRequest('Missing total amount')
    if (!user) throw CustomError.badRequest('Missing user')

    return new AppointmentEntity(_id.toString(), services, date, time, totalAmount, user)
  }
}
