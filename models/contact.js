const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const validateNumber = (number) => {
  const parts = number.split('-')
  if (parts.length === 2) {
    const prefix = parts[0]
    if (prefix.length === 2 || prefix.length === 3) {
      return /^\d+$/.test(parts.join(""))
    }
  }
  return false
}

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: validateNumber,
      message: "Number should be of form 123-45678 or 12-345678"
    },
    minlength: 8,
    required: true
  }
})


contactSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
