import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
// import { useData } from "../useData";
import logger from 'use-reducer-logger';
import axios from "axios";

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
            <h1>
                Top Courses
            </h1>
            <div className='courses'>
                {
                    loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) :
                        (
                            courses && courses.map((course) => {
                                return (
                                    <div className='course' key={course.id}>
                                        <Link to={`/course/${course.id}`}>
                                            <img src={course.image} alt={course.name} />
                                        </Link>
                                        <div className='course-info'>
                                            <Link to={`/course/${course.id}`}>
                                                <h5>{course.name}</h5>
                                            </Link>
                                            <p>{course.description}</p>
                                            <div>
                                                {course.hours} Hours
                                                <span><strong>${course.price}</strong>
                                                </span>
                                            </div>
                                            <button>Add to cart</button>
                                        </div>
                                    </div>
                                );
                            }
                            )
                        )
                }
            </div>
        </div>);
}

export default HomeScreen