import React from 'react'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import PropTypes from 'prop-types';

export default function CheckoutSteps(props) {
    const { step1, step2, step3, step4 } = props;
    return (
        <Row className="checkout-steps mb-3">
            <Col className={step1 ? 'active' : ''}>Sign-In</Col>
            <Col className={step2 ? 'active' : ''}>Add Address</Col>
            <Col className={step3 ? 'active' : ''}>Payment</Col>
            <Col className={step4 ? 'active' : ''}>Place Order</Col>
        </Row >
    )
}

CheckoutSteps.propTypes = {
    step1: PropTypes.bool,
    step2: PropTypes.bool,
    step3: PropTypes.bool,
    step4: PropTypes.bool,
};
