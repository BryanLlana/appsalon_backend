export class ServiceDto {
  constructor(
    public readonly name: string,
    public readonly price: number
  ){}

  static create (object: { [key: string]: any }): [Object?, ServiceDto?] {
    const { name, price } = object
    const errors: { [key: string]: any } = {}
    if (!name) errors.name = 'El nombre es obligatorio'
    if (!price) errors.price = 'El precio es obligatorio'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new ServiceDto(name, +price)]
  }
}