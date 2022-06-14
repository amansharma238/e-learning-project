import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useData } from "../useData";
import axios from "axios";
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

const reducer = (state, action) => {
    switch (action.type) {
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
    const navigate = useNavigate();
    const params = useParams();
    let { name } = params;
    // const { data } = useData();
    // let course = data.courses.filter(element => element.id == id);
    console.log(name);
    const [{ loading, error, course }, dispatch] = useReducer(reducer, {
        course: {},
        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/courses/${name}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })

            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [name]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const existItem = cart.cartItems.find((x) => x._id === course._id);

    const addToCartHandler = async () => {
        const quantity = 1;
        const { data } = await axios.get(`/api/courses/${course.name}`);
        console.log("data", data);
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...course, quantity } });
        navigate('/cart');
    }

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger" error={error} />
    ) : (
        <div className="courses">
            <Row>
                <Col md={6}>
                    <h2>Course Content</h2>
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
        </div>
    );
}

export default CourseScreen;