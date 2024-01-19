import { regularExps } from '../../../config'

export class AuthRegisterDto {
  constructor (
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ){}

  static create(object: {[key: string]: any}): [Object?, AuthRegisterDto?] {
    const { name, email, password, password2 } = object
    const errors: {[key: string]: any} = {}

    if (!name) errors.name = 'El nombre es obligatorio'
    if (!email) errors.email = 'El email es obligatorio'
    else if (!regularExps.email.test(email)) errors.email = 'Email no válido'       
    if (!password) errors.password = 'El password es obligatorio'
    else if (password.trim().length < 8) errors.password = 'El password es muy corto'
    else if (password !== password2) errors.password = 'Los passwords no son iguales'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new AuthRegisterDto(name, email, password)]
  }
}