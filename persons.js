const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')

require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const Person = require('./models/person')

//Errorhandler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }else if(error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}

//Number of persons in the phonebook
app.get('/api/info', (request, response) => {
  
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date}`)
  })
    
})  

//Get list of persons
app.get('/api/persons/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
}) 

//Get person by id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if(person){
        response.json(person)
        }else{
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

//Delete person
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//Morgan
morgan.token('person', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :person'))

//Add new persons
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  const name = body.name
  const number = body.number

  const person = new Person({
    name: name,
    number: number
  })
  //Check that name and number fields are not empty
  if(name === null || name === ''){
    return response.status(400).json({
      error: 'Please enter a valid name.'
    })
  }else if(number === null || number === ''){
    return response.status(400).json({
      error: 'Please enter a valid number.'
    })
  }

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error)) 
 
})

//Update person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  
  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true})
    .then(updatedPerson => {

        response.json(updatedPerson)
    
    })
    .catch(error => next(error))
})

//Errorhandler
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
