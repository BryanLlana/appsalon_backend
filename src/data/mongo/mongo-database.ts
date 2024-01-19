import mongoose from 'mongoose'
import colors from 'colors'

interface Options {
  mongoUrl: string,
  dbName: string
}

export class MongoDatabase {
  static async connect (options: Options) {
    const { mongoUrl, dbName } = options
    try {
      const db = await mongoose.connect(mongoUrl, {
        dbName
      })
      console.log(colors.green(`Mongo connected: ${db.connection.host}:${db.connection.port}`))
    } catch (error) {
      console.log(colors.red('Mongo connection error'))
      throw error
    }
  }

  static async disconnect () {
    await mongoose.disconnect()
  }
}