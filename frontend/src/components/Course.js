import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import React from 'react';
import PropTypes from 'prop-types';
import Rating from "./Rating";

function Course(props) {
    const course = props.course;
    return (
        <Card key={course.id}>
            <Link to={`/course/${course.id}`}>
                <img src={course.image} className="card-img-top" alt={course.name} />
            </Link>
            <Card.Body>
                <Link to={`/course/${course.id}`}>
                    <Card.Title>{course.name}</Card.Title>
                </Link>
                <Rating rating={course.rating} numReviews={course.numReviews} />
                <Card.Text>{course.description}</Card.Text>
                <Card.Text>{course.hours} Hours</Card.Text>
                <Card.Text>${course.price}</Card.Text>
                <Button>Add to cart</Button>
            </Card.Body>
        </Card>
    );
}

Course.propTypes = {
    course: PropTypes.object
};

export default Course;