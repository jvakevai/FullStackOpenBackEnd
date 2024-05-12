const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://johannesvakevainen:${password}@personsapp.v6nkvqy.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=personsapp`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length > 4){

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`Person ${person.name} ${person.number} saved to the phonebook.`)
    mongoose.connection.close()
  })
}
else{
  console.log('phonebook:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)})
      mongoose.connection.close()})
}

