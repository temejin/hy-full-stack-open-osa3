require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('post', (req,res) => {return JSON.stringify(res.body)})

app.get('/info', (request, response) => {
  Contact.find({})
    .then(contacts => {
      const infoText = `Phonebook has info for ${contacts.length} people<br><br>`
      const date = Date()
      response.send(infoText.concat(Date()))
  })
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.use(morgan('post'))
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => response.json(savedContact))
    .catch(error => next(error))
})

const unknownEndpoint = (request,response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response,next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(
    request.params.id,
    contact,
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  switch (error.name) {
    case 'CastError':
      return response.status(400).send({error: 'malformatted id'})
    case 'ValidationError':
      return response.status(400).send({error: error.message})
    default:
      return response.status(400).send({error: error.name})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
