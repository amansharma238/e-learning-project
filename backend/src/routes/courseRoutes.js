import express from 'express';
import Course from '../models/courseModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../middlewares/middleware.js';
const courseRouter = express.Router();


courseRouter.get('/', async (req, res) => {
    const courses = await Course.find();
    res.send(courses);
});

courseRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const lecture = {
            lectureId: 1, name: "sample", link: "Zxf1mnP5zcw"
        };
        const newCourse = new Course({
            name: 'sample name ' + Date.now(),
            image: '/images/p1.jpg',
            price: 0,
            category: 'sample category',
            hours: 0,
            rating: 0,
            numReviews: 0,
            numLectures: 1,
            description: 'sample description',
            lectures: [lecture],
            numberofpurchase: 0,
            Instructor: "Sample Instructor",
        });
        const course = await newCourse.save();
        res.send({ message: 'Course Created', course });
    })
);

courseRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (course) {
            course.name = req.body.name;
            course.Instructor = req.body.Instructor;
            course.price = req.body.price;
            course.image = req.body.image;
            course.category = req.body.category;
            course.hours = req.body.hours;
            course.description = req.body.description;
            course.lectures = req.body.lectures;
            await course.save();
            res.send({ message: 'Course Updated' });
        } else {
            res.status(404).send({ message: 'Course Not Found' });
        }
    })
);

courseRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const course = await Course.findById(req.params.id);
        if (course) {
            await course.remove();
            res.send({ message: 'Course Deleted' });
        } else {
            res.status(404).send({ message: 'Course Not Found' });
        }
    })
);


courseRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (course) {
            if (course.reviews.find((x) => x.name === req.user.name)) {
                return res
                    .status(400)
                    .send({ message: 'You already submitted a review' });
            }

            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            course.reviews.push(review);
            course.numReviews = course.reviews.length;
            course.rating =
                course.reviews.reduce((a, c) => c.rating + a, 0) /
                course.reviews.length;
            const updatedCourse = await course.save();
            res.status(201).send({
                message: 'Review Created',
                review: updatedCourse.reviews[updatedCourse.reviews.length - 1],
                numReviews: course.numReviews,
                rating: course.rating,
            });
        } else {
            res.status(404).send({ message: 'Course Not Found' });
        }
    })
);

courseRouter.get(
    '/:id/lectures/:lid',
    expressAsyncHandler(async (req, res) => {
        const courseId = req.params.id;
        const lecid = Number(req.params.lid);
        const course = await Course.findById(courseId);
        let lec;
        if (course) {
            course.lectures.map((x) => {
                if (x.lectureId === lecid) {
                    lec = x;
                }
            });
            res.send(lec);
        }
        else {
            res.status(404).send({ message: 'Lecture Not Found' });
        }
    })
);

courseRouter.delete(
    '/:id/lectures/:lid',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const courseId = req.params.id;
        const lecid = Number(req.params.lid);
        const course = await Course.findById(courseId);
        if (course) {
            var i = course.lectures.length;
            while (i--) {
                if (course.lectures[i].lectureId === lecid)
                    course.lectures.splice(i, 1);
            }
            await course.save();
            res.send({ message: 'Lecture Deleted' });
        }
        else {
            console.log("error");
        }
    })
);
courseRouter.post(
    '/:id/lectures',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (course) {
            const lecture = {
                lectureId: Math.random(),
                name: "sample",
                link: "Zxf1mnP5zcw",
            };
            course.lectures.push(lecture);
            course.numLectures = course.lectures.length;
            const updatedCourse = await course.save();
            res.status(201).send({
                message: 'Lecture Created',
                lecture: updatedCourse.lectures[updatedCourse.lectures.length - 1],
                numLectures: course.numLectures,
            });
        }
        else {
            console.log("error");
        }
    })
);

courseRouter.put(
    '/:id/lectures/:lid',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const courseId = req.params.id;
        const lecid = Number(req.params.lid);
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.map((x) => {
                if (x.lectureId === lecid) {
                    x.lectureId = req.body.lectureId,
                        x.name = req.body.lecturename,
                        x.link = req.body.lecturelink
                }
            });
            const updatedCourse = await course.save();
            res.status(201).send({
                message: 'Lecture updated',
                lecture: updatedCourse.lectures[updatedCourse.lectures.length - 1],
                numLectures: course.numLectures,
            });
        }
        else {
            console.log("error");
        }
    })
);

const PAGE_SIZE = 3;

courseRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const courses = await Course.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countCourses = await Course.countDocuments();
        res.send({
            courses,
            countCourses,
            page,
            pages: Math.ceil(countCourses / pageSize),
        });
    })
);

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

courseRouter.get('/name/:name', async (req, res) => {
    const course = await Course.findOne({ name: req.params.name });
    if (course)
        res.send(course);
    else {
        res.status(404).send({ message: 'Course Not Found' });
    }
})

courseRouter.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course)
            res.send(course);
        else {
            res.status(404).send({ message: 'Course Not Found' });
        }
    } catch (err) {
        console.log(err);
    }
})

export default courseRouter;