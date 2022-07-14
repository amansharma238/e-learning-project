import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { useData } from "../useData";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from "../components/Rating";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils/utils";
import { Store } from "../Store";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import LectureDropdown from "../components/LectureDropdown";

const reducer = (state, action) => {
    switch (action.type) {
        case 'REFRESH_COURSE':
            return { ...state, course: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreateReview: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreateReview: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreateReview: false };
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, course: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;

    }
};

function CourseScreen() {

    let reviewsRef = useRef();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const navigate = useNavigate();
    const params = useParams();
    let { name } = params;
    // const { data } = useData();
    // let course = data.courses.filter(element => element.id == id);
    const [{ loading, error, course, loadingCreateReview }, dispatch] = useReducer(reducer, {
        course: [],
        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/courses/name/${name}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })

            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [name]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const existItem = cart.cartItems.find((x) => x._id === course._id);

    const addToCartHandler = async () => {
        const quantity = 1;
        const { data } = await axios.get(`/api/courses/name/${course.name}`);
        console.log("data", data);
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...course, quantity } });
        navigate('/cart');
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error('Please enter comment and rating');
            return;
        }
        try {
            const { data } = await axios.post(
                `/api/courses/${course._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            dispatch({
                type: 'CREATE_SUCCESS',
            });
            toast.success('Review submitted successfully');
            course.reviews.unshift(data.review);
            course.numReviews = data.numReviews;
            course.rating = data.rating;
            dispatch({ type: 'REFRESH_COURSE', payload: course });
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop,
            });
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'CREATE_FAIL' });
        }
    };
    console.log("course ", course);
    console.log("lectures: ", course.lectures);
    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger" error={error} />
    ) : (
        <div>
            <Row>
                <Col md={6}>
                    <h2>Course Content</h2>
                    <div className="mb-3">
                        {course.lectures.length === 0 ? (
                            <MessageBox>There are no Lectures</MessageBox>
                        ) : (
                            course.lectures.map((lecture) => (
                                <div key={lecture.lectureId}>
                                    <LectureDropdown link={lecture.link} name={lecture.name} id={lecture.lectureId} />
                                </div>
                            ))
                        )}
                    </div>
                </Col>
                <Col md={6}>
                    <img className="img-large" src={course.image} alt={course.name}></img>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{course.name}</title>
                            </Helmet>
                            <h2>{course.name}</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating
                                rating={course.rating}
                                numReviews={course.numReviews}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price : ${course.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description:
                            <p>{course.description}</p>
                        </ListGroup.Item>
                        <Card>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <div className="text-center">
                                        <Button onClick={addToCartHandler} variant="primary" style={{ width: 120 }}>
                                            {existItem ? "Go to Cart" : "Add to Cart"}
                                        </Button>{' '}
                                        <Button variant="success" style={{ width: 100 }}>
                                            Buy
                                        </Button>
                                    </div>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </ListGroup>
                </Col>
            </Row>

            <div className="my-3">
                <h2 ref={reviewsRef}>Reviews</h2>
                <div className="mb-3">
                    {course.reviews.length === 0 && (
                        <MessageBox>There is no review</MessageBox>
                    )}
                </div>
                <ListGroup>
                    {course.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating rating={review.rating} caption=" "></Rating>
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className="my-3">
                    {userInfo ? (
                        <form onSubmit={submitHandler}>
                            <h2>Write a customer review</h2>
                            <Form.Group className="mb-3" controlId="rating">
                                <Form.Label>Rating</Form.Label>
                                <Form.Select
                                    aria-label="Rating"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1- Poor</option>
                                    <option value="2">2- Fair</option>
                                    <option value="3">3- Good</option>
                                    <option value="4">4- Very good</option>
                                    <option value="5">5- Excelent</option>
                                </Form.Select>
                            </Form.Group>
                            <FloatingLabel
                                controlId="floatingTextarea"
                                label="Comments"
                                className="mb-3"
                            >
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </FloatingLabel>

                            <div className="mb-3">
                                <Button disabled={loadingCreateReview} type="submit">
                                    Submit
                                </Button>
                                {loadingCreateReview && <LoadingBox></LoadingBox>}
                            </div>
                        </form>
                    ) : (
                        <MessageBox>
                            Please{' '}
                            <Link to={`/signin?redirect=/course/${course.name}`}>
                                Sign In
                            </Link>{' '}
                            to write a review
                        </MessageBox>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CourseScreen;