const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')

app.use(cors())
app.use(express.json())

let persons = [
    {
     "name": "Ada Lovelace",
     "number": "1234",
      "id": 2
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "2131234"
    },
    {
      "id": 1,
      "name": "Johannes Väkeväinen",
      "number": "2131234"
    }


]

app.get('/api/info', (request, response) => {
    let numberOfPersons = persons.length
    let ts = new Date()
    console.log(ts)
    response.send(`This phonebook has info for ${numberOfPersons} people <br/><br/> ${new Date}`)
})  
app.get('/api/persons/', (request, response) => {
  response.json(persons)
}) 

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
    response.json(person)
    }else{
      response.status(400).end()
    }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  body.id = Math.floor(Math.random()*1000)

  if(!body.name){
    response.status(400).json({error: 'Person name missing'})
  }else if(!body.number){
    response.status(400).json({error: 'Person number missing'})
  }else if(persons.some(({name}) => name === body.name)){
    response.status(400).json({error: 'Person is already on the list'})
  }else{
    const person = {
      name: body.name,
      number: body.number,
      id: body.id,
    }
    persons = persons.concat(person)
    response.json(person)
  }

  morgan.token('person', (req) => {
    return JSON.stringify(req.body)
  })
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//3.9 tehty