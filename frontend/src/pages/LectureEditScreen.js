import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils/utils';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        lecture: action.payload,
        loading: false
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function LectureListScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: courseId, lid: lecId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate,
  }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });



  const [lectureId, setLectureId] = useState(lecId);
  const [lecturename, setLectureName] = useState('');
  const [lecturelink, setLectureLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/courses/${courseId}/lectures/${lecId}`);
        console.log("data: ", data);
        setLectureId(data.lectureId);
        setLectureName(data.name);
        setLectureLink(data.link);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [courseId, lecId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/courses/${courseId}/lectures/${lecId}`,
        {
          lectureId,
          lecturename,
          lecturelink,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Lecture updated successfully');
      navigate(`/admin/course/${courseId}`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Edit Lecture</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Container className="small-container">
          <h1>Edit Lecture {lecId}</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="lectureId">
              <Form.Label>Lecture Number</Form.Label>
              <Form.Control
                value={lectureId}
                onChange={(e) => setLectureId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lecturename">
              <Form.Label>Lecture Name</Form.Label>
              <Form.Control
                value={lecturename}
                onChange={(e) => setLectureName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lecturelink">
              <Form.Label>Lecture Link</Form.Label>
              <Form.Control
                value={lecturelink}
                onChange={(e) => setLectureLink(e.target.value)}
                required
              />
            </Form.Group>
            <div className="mb-3">
              <Button disabled={loadingUpdate} type="submit">
                Update
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
        </Container>
      )
      }
    </div>
  )
}
