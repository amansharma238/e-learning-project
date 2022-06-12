import { useNavigate, Link } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Rating from "./Rating";
import { Store } from "../Store";

function Course(props) {

    const course = props.course;
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const existItem = cart.cartItems.find((x) => x._id === course._id);

    const addToCartHandler = async () => {
        const quantity = 1;
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...course, quantity } });
        navigate('/cart');
    }
    return (
        <Card key={course._id}>
            <Link to={`/course/${course.name}`}>
                <img src={course.image} className="card-img-top" alt={course.name} />
            </Link>
            <Card.Body>
                <Link to={`/course/${course._id}`}>
                    <Card.Title>{course.name}</Card.Title>
                </Link>
                <Rating rating={course.rating} numReviews={course.numReviews} />
                <Card.Text>{course.description}</Card.Text>
                <Card.Text>{course.hours} Hours</Card.Text>
                <Card.Text>${course.price}</Card.Text>
                <Button onClick={addToCartHandler} variant="primary">
                    {existItem ? "Go to Cart" : "Add to Cart"}
                </Button>
            </Card.Body>
        </Card>
    );
}

Course.propTypes = {
    course: PropTypes.object
};

export default Course;