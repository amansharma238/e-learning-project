import axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils/utils'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                course: action.payload,
                loading: false
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
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
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };

        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

export default function CourseEditScreen() {

    const navigate = useNavigate();
    const params = useParams(); // /course/:id
    const { id: courseId } = params;

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, course, loadingUpdate, loadingUpload, loadingCreate, loadingDelete, successDelete,
    }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [name, setName] = useState('');
    const [Instructor, setInstructor] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [hours, setHours] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/courses/${courseId}`);
                setName(data.name);
                setInstructor(data.Instructor);
                setPrice(data.price);
                setHours(data.hours);
                setImage(data.image);
                setCategory(data.category);
                setDescription(data.description);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [courseId]);

    const createHandler = async () => {
        if (window.confirm('Are you sure to create?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(
                    `/api/courses/${courseId}/lectures`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                toast.success('lecture created successfully');
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/course/${data.course._id}`);
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'CREATE_FAIL',
                });
            }
        }
    };


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
            setImage(data.secure_url);
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
        }
    };

    const submitHandler = async (e) => {

        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/courses/${courseId}`,
                {
                    _id: courseId,
                    name,
                    Instructor,
                    price,
                    image,
                    category,
                    hours,
                    description,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            toast.success('Course updated successfully');
            navigate('/admin/courses');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };

    const deleteHandler = async (lecture) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await axios.delete(`/api/courses/${course._id}/lectures/${lecture.lectureId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('lecture deleted successfully');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>Edit Course ${courseId}</title>
            </Helmet>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <Row>
                    <Col md={6}>
                        <Container className="small-container">
                            <h1>Edit Course {courseId}</h1>
                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Course Name</Form.Label>
                                    <Form.Control
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="instructor">
                                    <Form.Label>Instructor Name</Form.Label>
                                    <Form.Control
                                        value={Instructor}
                                        onChange={(e) => setInstructor(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="hours">
                                    <Form.Label>Hours</Form.Label>
                                    <Form.Control
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        required
                                    />
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="image">
                                    <Form.Label>Image File</Form.Label>
                                    <Form.Control
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="category">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="imageFile">
                                    <Form.Label>Upload File</Form.Label>
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
                        </Container>
                    </Col>
                    <Col md={6}>
                        <h2>Edit Lectures</h2>
                        <Row>
                            <Col className="col text-end">
                                <div>
                                    <Button type="button" onClick={createHandler}>
                                        Create Lecture
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        {loadingCreate && <LoadingBox></LoadingBox>}
                        {loadingDelete && <LoadingBox></LoadingBox>}
                        {loading ? (
                            <LoadingBox />
                        ) : error ? (
                            <MessageBox variant='danger'>{error}</MessageBox>
                        ) : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>NAME</th>
                                            <th>LINK</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.lectures.map((lecture) => (
                                            <tr key={lecture.lectureId}>
                                                <td>{lecture.lectureId}</td>
                                                <td>{lecture.name}</td>
                                                <td>{lecture.link}</td>
                                                <td>
                                                    <Button
                                                        type="button"
                                                        variant="light"
                                                        onClick={() => navigate(`/admin/course/${courseId}/lecture/${lecture.lectureId}`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    &nbsp;
                                                    <Button
                                                        type="button"
                                                        variant="light"
                                                        onClick={() => deleteHandler(lecture)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </Col>
                </Row>
            )}
        </div>
    )
}
