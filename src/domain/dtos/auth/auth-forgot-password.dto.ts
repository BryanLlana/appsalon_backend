import { regularExps } from "../../../config"

export class ForgotPasswordDto {
  constructor (
    public readonly email: string
  ){}

  static create(object: {[key: string]: any}): [Object?, ForgotPasswordDto?]{
    const { email } = object
    const errors: {[key: string]: any} = {}
    if (!email) errors.email = 'El email es obligatorio'
    if (!regularExps.email.test(email)) errors.email = 'El email no es válido'
    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new ForgotPasswordDto(email)]
  }
}