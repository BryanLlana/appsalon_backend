import mongoose from "mongoose"
import { DateFnsAdapter } from "../../../config/adapter"

export class AppointmentDto {
  constructor(
    public readonly services: string[] | mongoose.Types.ObjectId[],
    public readonly date: string | Date,
    public readonly time: string,
    public readonly totalAmount: number,
    public readonly user: string
  ) {}

  static create(object: {[key: string]: any}): [Object?, AppointmentDto?] {
    const { services, date, time, totalAmount, user } = object
    const errors: {[key: string]: any} = {}

    if (services.length === 0) errors.services = 'No hay servicios seleccionados'
    if (!date) errors.date = 'La fecha es obligatoria'
    if (!time) errors.time = 'La hora es obligatorio'
    if (!totalAmount) errors.totalAmount = 'El total es obligatorio'

    if(Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new AppointmentDto(services, DateFnsAdapter.convertToISO(date), time, totalAmount, user.id)]
  }
}