import express from "express";
import data from './data.js'
const app = express();

app.get('/api/courses', (req, res) => {
    res.send(data.courses);
})

app.get('/api/courses/:id', (req, res) => {
    const course = data.courses.find((x) => x.id == req.params.id);
    if (course)
        res.send(course);
    else {
        res.status(404).send({ message: 'Course Not Found' });
    }
})


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});