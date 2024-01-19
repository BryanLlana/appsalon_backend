import jwt from 'jsonwebtoken'
import { envs } from '../envs'

export class JwtAdapter {
  static generateToken (payload: any, duration: string = '5h'): Promise<string|null> {
    return new Promise(resolve => {
      jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null)
        resolve(token!)
      })
    })
  }

  static validateToken<T> (token: string): Promise<T|null> {
    return new Promise(resolve => {
      jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
        if (err) return resolve(null)
        return resolve(decoded as T)
      })
    })
  }  
}