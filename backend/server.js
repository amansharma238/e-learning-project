import express from "express";
// import data from './data.js';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import seedRouter from "./src/routes/seedRoutes.js";
import courseRouter from "./src/routes/courseRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import orderRouter from "./src/routes/orderRoutes.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log(err.message);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});


app.use('/api/seed', seedRouter);


// Instead of this
// app.get('/api/courses', (req, res) => {
//     res.send(data.courses);
// })

// we use

app.use('/api/courses', courseRouter);


// Instead of this
// app.get('/api/courses/:id', (req, res) => {
//     const course = data.courses.find((x) => x.id == req.params.id);
//     if (course)
//         res.send(course);
//     else {
//         res.status(404).send({ message: 'Course Not Found' });
//     }
// })

// we use


app.use('/api/users', userRouter);

app.use('/api/orders', orderRouter);

// error in server this middleware will run
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});