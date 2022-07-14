import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils/utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
};

export default function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [profile_pic, setProfilePic] = useState(userInfo.profile_pic);
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [{ loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
        });

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });
            dispatch({ type: 'UPLOAD_SUCCESS' });
            toast.success('Image uploaded successfully');
            setProfilePic(data.secure_url);
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.warning("Password doesn't Match");
        }
        else {
            try {
                const { data } = await axios.put(
                    '/api/users/profile',
                    {
                        name,
                        email,
                        password,
                        profile_pic,
                    },
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({
                    type: 'UPDATE_SUCCESS',
                });
                ctxDispatch({ type: 'USER_SIGNIN', payload: data });
                localStorage.setItem('userInfo', JSON.stringify(data));
                toast.success('User updated successfully');
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                });
                toast.error(getError(err));
            }
        }
    };

    return <div className='container small-container'>
        <Helmet>
            <title>User Profile</title>
        </Helmet>
        <h1 className='my-3'>User Profile</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control value={name} onChange={(e) => setName(e.target.value)} required>
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="imageFile">
                <Form.Label>Change Profile Picture</Form.Label>
                <Form.Control type="file" onChange={uploadFileHandler} />
                {loadingUpload && <LoadingBox></LoadingBox>}
            </Form.Group>

            <div className="mb-3">
                <Button disabled={loadingUpdate} type="submit">
                    Update
                </Button>
                {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
        </Form>
    </div>
}
