const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://teukka:${password}@cluster0.czaej9r.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)


if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    console.log('phonebook:')
    result.map(c => console.log(`${c.name} ${c.number}`))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })
  contact.save().then(() => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Give a name and number to save into database, or leave blank to fetch data')
}
