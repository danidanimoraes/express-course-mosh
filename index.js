const express = require('express');
const Joi = require('joi'); // Returns a class

// Contains http methods (post, get, put, delete)
const app = express();

// Uses middleware to parse json in post request
app.use(express.json());

const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'},
];

// Maps routes

// GET
app.get('/', (request, response) => response.send('This is the root :)'));

app.get('/api/courses', (request, response) => response.send(courses));

app.get('/api/courses/:id', (request, response) => 
{
    const course = courses.find((course) => course.id === parseInt(request.params.id));

    if (!course)
    {
        // Course not found: 404 NOT FOUND
        return response.status(404).send('The course with the given id was not found.');
    }

    response.send(course);
});

// POST
app.post('/api/courses', (request, response) =>
{
    const { error } = validateCourse(request.body); // Result = {error, body}

    if (error)
    {
        return response.status(400).send(error.details[0].message);
    }

    const course =
    { 
        id: courses.length + 1,
        name: request.body.name
    };

    courses.push(course);
    response.send(course);
});

// PUT
app.put('/api/courses/:id', (request, response) => 
{
    // Look up the course. If not found, 404
    const course = courses.find((course) => course.id === parseInt(request.params.id));

    if (!course)
    {
        // Course not found: 404 NOT FOUND
        return response.status(404).send('The course with the given id was not found.');
    }

    // Validate the course. If not valid, 400
    const { error } = validateCourse(request.body); // Result = {error, body}

    if (error)
    {
        return response.status(400).send(error.details[0].message);
    }

    course.name = request.body.name;
    response.send(course);
});

// DELETE
app.delete('/api/courses/:id', (request, response) =>
{
    // Look up the course. If not found, 404
    const course = courses.find((course) => course.id === parseInt(request.params.id));

    if (!course)
    {
        // Course not found: 404 NOT FOUND
        return response.status(404).send('The course with the given id was not found.');
    }

    courses.splice(courses.indexOf(course), 1);
    response.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

/**
 * Validates the structure of the given course
 * against the course schema.
 *
 * @param course The course to be validated
 */
function validateCourse(course)
{
    const schema =
    {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}