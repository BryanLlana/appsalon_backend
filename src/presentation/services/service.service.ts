import { Validators } from '../../config'
import { ServiceModel } from '../../data/mongo'
import { ServiceDto } from '../../domain/dtos'
import { ServiceEntity } from '../../domain/entities'
import { CustomError } from '../../domain/errors'

export class ServiceService {
  constructor(){}

  async createService (serviceDto: ServiceDto) {
    const serviceExists = await ServiceModel.findOne({ name: serviceDto.name })
    if (serviceExists) throw CustomError.badRequest('Servicio existente')

    try {
      const service = new ServiceModel(serviceDto)
      await service.save()

      const serviceEntity = ServiceEntity.fromObject(service)
      return {
        msg: 'Servicio creado correctamente',
        service: serviceEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  } 

  async getServices () {
    try {
      const services = await ServiceModel.find()
      const servicesEntity = services.map(service => ServiceEntity.fromObject(service))
      return {
        services: servicesEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  async getService (id: string) {
    if (!Validators.isMongoID(id)) throw CustomError.badRequest('ID no válido')
    const serviceExists = await ServiceModel.findById(id)
    if (!serviceExists) throw CustomError.notFound('Servicio inexistente')
    const serviceEntity = ServiceEntity.fromObject(serviceExists)
    return {
      service: serviceEntity
    }
  }

  async updateService (serviceDto: ServiceDto, id: string) {
    await this.getService(id)
    const service = await ServiceModel.findById(id)
    service!.name = serviceDto.name
    service!.price = serviceDto.price

    try {
      await service!.save()
      const serviceEntity = ServiceEntity.fromObject(service!)
      return {
        msg: 'Servicio modificado correctamente',
        service: serviceEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }

  async deleteService (id: string) {
    await this.getService(id)
    const service = await ServiceModel.findById(id)

    try {
      await service!.deleteOne()
      const serviceEntity = ServiceEntity.fromObject(service!)
      return {
        msg: 'Servicio eliminado correctamente',
        service: serviceEntity
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }
}