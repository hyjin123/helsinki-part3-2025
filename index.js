require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  const day = date.toDateString();
  const time = date.toLocaleTimeString();
  response.send(`<p>Phonebook has info for ${persons.length} people </br> ${day} ${time}</p>`);
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id).then(person => {
    response.json(person);
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  // updated the database list
  Person.findByIdAndDelete(id).then(person => {
    response.json(person);
  });
});

app.post('/api/persons', (request, response) => {
  const person = request.body;

  console.log("this is the request body", person);
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "name or number is missing"
    });
  }

  const duplicate = persons.find(p => p.name.toLowerCase() === person.name.toLowerCase());

  if (duplicate) {
    return response.status(400).json({
      error: "name already exists in the phonebook"
    });
  }

  const newPerson = new Person(person);

  newPerson.save().then(savedPerson => {
    response.json(savedPerson);
  });

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});