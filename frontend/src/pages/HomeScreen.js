import React, { useEffect, useReducer } from "react";
// import { useData } from "../useData";
import logger from 'use-reducer-logger';
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Course from "../components/Course";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, courses: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;

    }
};

function HomeScreen() {
    // const { data } = useData();
    // const [courses, setCourses] = useState([]);

    const [{ loading, error, courses }, dispatch] = useReducer(logger(reducer), {
        courses: [],
        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/courses');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })

            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
            // setCourses(result.data);
        };
        fetchData();
    }, []);
    return (
        <div>
            <Helmet>
                <title>E-Learning</title>
            </Helmet>
            <div className='courses px-5'>
                <h1>Top Courses</h1>
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant="danger" error={error} />
                ) : (
                    <Row>
                        {courses.map((course) =>
                            <Col key={course._id} sm={6} md={4} lg={3} className="mb-3">
                                <Course course={course}></Course>
                            </Col>
                        )}
                    </Row>
                )
                }
            </div>
        </div>);
}

export default HomeScreen