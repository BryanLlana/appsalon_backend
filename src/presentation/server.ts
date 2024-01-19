import express, { Router } from 'express'

interface Options {
  port: number,
  routes: Router,
  cors: Function
}

export class Server {
  private readonly app = express()
  private readonly port: number
  private readonly routes: Router
  private readonly cors: Function
  private serverListener?: any

  constructor (options: Options) {
    const { port, routes, cors } = options
    this.port = port
    this.routes = routes
    this.cors = cors
  }

  public start() {
    //* Middlewares
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(this.cors())

    //* Routes
    this.app.use(this.routes)

    //* Listen
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`)
    })
  }

  public close() {
    this.serverListener?.close()
  }
}