import express from "express";
import path from 'path';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import seedRouter from "./src/routes/seedRoutes.js";
import courseRouter from "./src/routes/courseRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import orderRouter from "./src/routes/orderRoutes.js";
import uploadRouter from "./src/routes/uploadRoutes.js";

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

app.get('/api/keys/google', (req, res) => {
    res.send({ key: process.env.GOOGLE_API_KEY || '' });
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
app.use('/api/upload', uploadRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

// error in server this middleware will run
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});