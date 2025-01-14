import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
export default function AddressScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const {
        fullBox,
        userInfo,
        cart: { Address },
    } = state;

    const [fullName, setFullName] = useState(Address.fullName || '');
    const [address, setAddress] = useState(Address.address || '');
    const [city, setCity] = useState(Address.city || '');

    const [postalCode, setPostalCode] = useState(Address.postalCode || '');
    const [country, setCountry] = useState(Address.country || '');

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/Address');
        }
    }, [userInfo, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
                location: Address.location,
            },
        });

        localStorage.setItem(
            'Address',
            JSON.stringify({
                fullName,
                address,
                city,
                postalCode,
                country,
                location: Address.location,
            })
        );
        navigate('/payment');
    }

    useEffect(() => {
        ctxDispatch({ type: 'SET_FULLBOX_OFF' });
    }, [ctxDispatch, fullBox]);


    return (
        <div>
            <Helmet>
                <title>Address</title>
            </Helmet>
            <CheckoutSteps step1 step2 />
            <div className='container small-container'>
                <h1 className='my-3'>Address</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="postalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <div className="mb-3">
                        <Button
                            id="chooseOnMap"
                            type="button"
                            variant="light"
                            onClick={() => navigate('/map')}
                        >
                            Choose Location On Map
                        </Button>
                        {Address.location && Address.location.lat ? (
                            <div>
                                LAT: {Address.location.lat}
                                LNG:{Address.location.lng}
                            </div>
                        ) : (
                            <div>No location</div>
                        )}
                    </div>

                    <div className='mb-3'>
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </div>
                </Form>
            </div>

        </div>
    )
}
