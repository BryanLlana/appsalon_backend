import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/adapter";
import { userModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities";

export class AuthMiddleware {
  constructor (){}

  static async validateJwt (req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization')
    if (!authorization) return res.status(401).json({ error: 'Token no registrado' })
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Token bearer inválido' })

    const token = authorization.split(' ')[1] || ''
    try {
      const payload = await JwtAdapter.validateToken<{ id: string}>(token)
      if (!payload) return res.status(401).json({ error: 'Token inválido' })
      const user = await userModel.findById(payload.id)
      if (!user) return res.status(401).json({ error: 'Token inválido - usuario' })

      req.body.user = UserEntity.fromObject(user)
      next()
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}