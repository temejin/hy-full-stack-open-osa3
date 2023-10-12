const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('post', (req,res) => {return JSON.stringify(res.body)})

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-532523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const infoText = `Phonebook has info for ${contacts.length} people<br><br>`
  if (request.headers.date) {
    response.send(infoText.concat(request.headers.date))
  } else {
  const date = Date()
  response.send(infoText.concat(Date()))
  }
})

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)
  response.status(204).end()
})

app.use(morgan('post'))
app.post('/api/persons', (request, response) => {
  const newId = Math.floor(Math.random()*10000)
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'Name must not be empty' 
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number must be non empty'
    })
  }
  
  if (contacts.map(c => c.name).includes(body.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const contact = {
    id: newId,
    name: body.name,
    number: body.number
  }

  contacts = contacts.concat(contact)
  response.json(contact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
