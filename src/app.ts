import { envs } from './config'
import { CorsAdapter } from './config/adapter'
import { MongoDatabase } from './data/mongo'
import { AppRoutes, Server } from './presentation'

(() => {
  main()
})()

async function main() {
  await MongoDatabase.connect({ mongoUrl: envs.MONGO_URL, dbName: envs.MONGO_DB_NAME })
  const server = new Server({ port: envs.PORT, routes: AppRoutes.routes, cors: CorsAdapter.create() })
  server.start()
}