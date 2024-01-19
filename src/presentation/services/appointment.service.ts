import mongoose from "mongoose";
import { Validators } from "../../config";
import { DateFnsAdapter } from "../../config/adapter";
import { appointmentModel } from "../../data/mongo/models/appointment.model";
import { AppointmentDto } from "../../domain/dtos";
import { AppointmentEntity, ServiceEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class AppointmentService {
  constructor () {}

  public async createAppointment (appointmentDto: AppointmentDto) {
    try {
      const appointment = new appointmentModel(appointmentDto)
      appointment.save()

      const appointmentEntity = AppointmentEntity.fromObject(appointment)

      return {
        msg: 'La reservación fue guardada correctamente',
        appointment: appointmentEntity
      }
    } catch (error) {
      console.log(error)
      throw CustomError.internalServer(`${error}`)
    }
  }

  public async getAppointmentsByDate (date: string) {
    try {
      const isoDate = DateFnsAdapter.convertToISO(date)
      const appointments = await appointmentModel.find({
        date: {
          $gte: DateFnsAdapter.startOfDay(isoDate),
          $lte: DateFnsAdapter.endOfDay(isoDate)
        }
      })
      const appointmentsEntity = appointments.map(appointment => AppointmentEntity.fromObject(appointment))
      return {
        appointments: appointmentsEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  public async getAppointmentById (id: string, authUser: string) {
    if (!Validators.isMongoID(id)) throw CustomError.badRequest('Id no válida')
    const appointment = await appointmentModel.findById(id).populate('services')
    if (!appointment) throw CustomError.notFound('La reservación no existe')
    const { services, ...appointmentEntity } = AppointmentEntity.fromObject(appointment)
    if (appointmentEntity.user.toString() !== authUser) throw CustomError.unauthorized('Acción no válida')
    const servicesEntity = services.map(service => ServiceEntity.fromObject(service as Object))

    return {
      appointment: {
        ...appointmentEntity,
        services: servicesEntity
      }
    }
  }

  public async updateAppointment (id: string, appoinmentDto: AppointmentDto) {
    await this.getAppointmentById(id, appoinmentDto.user)
    const appointment = await appointmentModel.findById(id)
    appointment!.date = appoinmentDto.date as Date
    appointment!.time = appoinmentDto.time
    appointment!.totalAmount = appoinmentDto.totalAmount
    appointment!.services = appoinmentDto.services as mongoose.Types.ObjectId[]

    try {
      const result = await appointment!.save()
      const appointmentEntity = AppointmentEntity.fromObject(result)
      return {
        msg: 'Reservación modificada correctamente',
        appointment: appointmentEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`)
    }
  }

  public async deleteAppoinment (id: string, authUser: string) {
    await this.getAppointmentById(id, authUser)
    const appointment = await appointmentModel.findById(id)

    try {
      await appointment!.deleteOne()
      return {
        msg: 'Reservación cancelada',
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`)
    }
  }
}