import { CustomError } from "../errors"

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly verified: boolean,
    public readonly admin: boolean,
    public readonly token: string
  ) {}

  static fromObject(object: {[key: string]: any}): UserEntity {
    const { _id, name, email, verified, admin, token } = object
    if (!_id) throw CustomError.badRequest('Missing id')
    if (!name) throw CustomError.badRequest('Missing name')
    if (!email) throw CustomError.badRequest('Missing email')

    return new UserEntity(_id.toString(), name, email, verified, admin, token)
  }
}