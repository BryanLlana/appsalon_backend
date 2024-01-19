import { envs } from '../../config'
import { MongoDatabase, ServiceModel } from '../mongo'
import { services } from './data'

const seedDB = async () => {
  await MongoDatabase.connect({ mongoUrl: envs.MONGO_URL, dbName: envs.MONGO_DB_NAME })

  try {
    await ServiceModel.insertMany(services)
    console.log('Se agregaron los datos correctamente')
  } catch (error) {
    console.log(error)
  }

  await MongoDatabase.disconnect()
}

const clearDB = async () => {
  await MongoDatabase.connect({ mongoUrl: envs.MONGO_URL, dbName: envs.MONGO_DB_NAME })

  try {
    await ServiceModel.deleteMany()
    console.log('Se eliminaron los datos correctamente')
  } catch (error) {
    console.log(error)
  }

  await MongoDatabase.disconnect()
}

if (process.argv[2] === '--import') {
  seedDB()
} else {
  clearDB()
}