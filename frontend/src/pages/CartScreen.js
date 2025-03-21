import { React, useContext } from "react"
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { Store } from "../Store"
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

export default function CartScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;


    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const checkoutHandler = () => {
        navigate('/signin?redirect=/address');
    }

    return (
        <div>
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <Row>
                <h1>Courses in Cart</h1>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={8}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={item.image} alt={item.name} className="rounded img-thumbnail img-fluid" />{' '}
                                                <Link to={`/course/${item.name}`} style={{ textDecoration: 'none', margin: '0% 0% 0% 2%' }}>{item.name}</Link>
                                            </div>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={1}>
                                            <Button
                                                onClick={() => removeItemHandler(item)}
                                                variant="light">
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>

                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items):$
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroupItem>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}>
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}