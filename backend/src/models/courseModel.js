import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const lectureSchema = new mongoose.Schema(
    {
        lectureId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        link: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const courseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        hours: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        numberofpurchase: { type: Number, required: true },
        rating: { type: Number, required: true },
        numReviews: { type: Number, required: true },
        numLectures: { type: Number, required: true },
        reviews: [reviewSchema],
        lectures: [lectureSchema],
        Instructor: { type: String, required: true },
        description: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;