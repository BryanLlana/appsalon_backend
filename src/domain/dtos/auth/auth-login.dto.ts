import { regularExps } from "../../../config"

export class AuthLoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: {[key: string]: any}): [Object?, AuthLoginDto?] {
    const { email, password } = object
    const errors: {[key: string]: any} = {}

    if (!email) errors.email = 'El email es obligatorio'
    else if (!regularExps.email.test(email)) errors.email = 'El email no es válido'
    if (!password) errors.password = 'El password es obligatorio'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new AuthLoginDto(email, password)]
  }
}