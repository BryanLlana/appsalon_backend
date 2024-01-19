import { CustomError } from "../errors"

export class ServiceEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number
  ) {}

  static fromObject (object: {[key: string]: any}): ServiceEntity {
    const { _id, name, price } = object
    if (!_id) throw CustomError.badRequest('Missing id')
    if (!name) throw CustomError.badRequest('Missing name')
    if (!price) throw CustomError.badRequest('Missing price')

    return new ServiceEntity(_id.toString(), name, price)
  }
}