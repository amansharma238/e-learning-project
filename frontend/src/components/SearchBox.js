import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    }

    return (
        <Form className='d-flex me-auto' onSubmit={submitHandler}>
            <InputGroup>
                <FormControl type="text" name="q" id="q" onChange={(e) => setQuery(e.target.value)}
                    placeholder="search courses..." aria-label="Search Courses" aria-labelledby="button-search">

                </FormControl>
                <Button variant='outline-primary' type="submit" id='button-search'>
                    <i className='fas fa-search'></i>
                </Button>
            </InputGroup>
        </Form>
    )
}
