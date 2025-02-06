const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'must be at least 3 characters long, got "{VALUE}"'],
    required: true
  },
  number: {
    type: String,
    validate: [
      (v) => v.length >= 8 && /^\d{2,3}-\d+$/.test(v),
      '"{VALUE}" is not a valid phone number'
    ],
    required: true,
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)