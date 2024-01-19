import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],
  date: {
    type: Date
  },
  time: {
    type: String
  },
  totalAmount: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const appointmentModel = mongoose.model('Appointment', appointmentSchema)