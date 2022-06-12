import express from 'express';
import Course from '../models/courseModel.js';
import data from '../../data.js';
import User from '../models/userModel.js'

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    await Course.remove({});
    const createdCourses = await Course.insertMany(data.courses);

    await User.remove({});
    const createdUsers = await User.insertMany(data.users);

    res.send({ createdCourses, createdUsers });
});

export default seedRouter;