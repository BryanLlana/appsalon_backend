export class UpdatePasswordDto {
  constructor(
    public readonly password: string
  ){}

  static create(object: {[key: string]: any}): [Object?, UpdatePasswordDto?] {
    const { password } = object
    const errors: {[key: string]: any} = {}
    if (!password) errors.password = 'El password es obligatorio'
    if (password.trim().length < 8) errors.password = 'El password es muy corto'
    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new UpdatePasswordDto(password)]
  }
}