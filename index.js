const express = require('express')
const morgan = require('morgan')
const app = express()

let book = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]


// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }
// app.use(requestLogger)

app.use(express.json());

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))


app.get('/api/persons', (request, response) => {
    response.json(book)
})

app.get('/api/persons/:id', (request, response) => {
    const id = String(request.params.id)
    const person = book.find(guy => guy.id === id)
    if (person) {
        response.json(person)
    } else {
        console.log(`No person found with ID ${id}`)
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {

    let date = new Date()

    response.send(`
        <div>
            <p>Phonebook has info for 2 people</p>
            <p>${date}</p>
        </div>
    `);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = String(request.params.id)
    book = book.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // console.log(request.headers)

    if (!body.name) {
        return response.status(400).json({
            error: 'error missing name'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'error missing number'
        })
    }

    if (book.find(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'Name already exists'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 100),
        name: body.name,
        number: body.number,
    }

    book = book.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

let PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})