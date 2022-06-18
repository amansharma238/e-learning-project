import express from 'express';
import Course from '../models/courseModel.js';
import expressAsyncHandler from 'express-async-handler';

const courseRouter = express.Router();


courseRouter.get('/', async (req, res) => {
    const courses = await Course.find();
    res.send(courses);
});

const PAGE_SIZE = 3;

courseRouter.get('/search', expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                name: {
                    $regex: searchQuery,
                    $options: 'i',
                },
            }
            : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                    $gte: Number(rating),
                },
            }
            : {};
    const priceFilter =
        price && price !== 'all'
            ? {
                // 1-50
                price: {
                    $gte: Number(price.split('-')[0]),
                    $lte: Number(price.split('-')[1]),
                },
            }
            : {};
    const sortOrder =
        order === 'featured'
            ? { featured: -1 }
            : order === 'lowest'
                ? { price: 1 }
                : order === 'highest'
                    ? { price: -1 }
                    : order === 'toprated'
                        ? { rating: -1 }
                        : order === 'newest'
                            ? { createdAt: -1 }
                            : { _id: -1 };

    const courses = await Course.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    const countCourses = await Course.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    });
    res.send({
        courses,
        countCourses,
        page,
        pages: Math.ceil(countCourses / pageSize),
    });

}));

courseRouter.get('/categories', expressAsyncHandler(async (req, res) => {
    const categories = await Course.find().distinct('category');
    res.send(categories);
})
);

courseRouter.get('/:name', async (req, res) => {
    const course = await Course.findOne({ name: req.params.name });
    if (course)
        res.send(course);
    else {
        res.status(404).send({ message: 'Course Not Found' });
    }
})

courseRouter.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course)
        res.send(course);
    else {
        res.status(404).send({ message: 'Course Not Found' });
    }
})

export default courseRouter;