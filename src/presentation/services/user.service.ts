import { Validators } from "../../config";
import { appointmentModel } from "../../data/mongo/models/appointment.model";
import { AppointmentEntity, ServiceEntity, UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class UserService {
  constructor() { }

  public async getAppointmentsOfUser(user: string, authUser: string, admin: boolean) {
    if (Validators.isMongoID(user)) {
      if (user !== authUser) throw CustomError.unauthorized('Acción no válida')
      const mongoDate = new Date()
      mongoDate.setHours(0, 0, 0, 0)
      const query = admin ? {
        date: {
          $gte: mongoDate
        }
      } : {
        user,
        date: {
          $gte: mongoDate
        }
      }
      const appointments = await appointmentModel.find(query).populate('services').populate('user').sort({ date: 'asc'})

      if (appointments.length === 0) throw CustomError.notFound('No tienes reservaciones')

      const appointmentsEntity = appointments.map(appointment => {
        const { services, user, ...appointmentEntity } = AppointmentEntity.fromObject(appointment)
        const userEntity = UserEntity.fromObject(user as Object)
        const servicesEntity = services.map(service => ServiceEntity.fromObject(service as Object))
        return {
          ...appointmentEntity,
          services: servicesEntity,
          user: userEntity
        }
      })
      return {
        appointments: appointmentsEntity
      }
    } else {
      throw CustomError.badRequest('Id user no válido')
    }
  }
}