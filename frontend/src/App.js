import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import CourseScreen from './pages/CourseScreen';
import HomeScreen from './pages/HomeScreen';
import Mycontext from './context';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
let data = {
  courses: [
    {
      id: 1,
      name: "Build a fullstack Netflix Clone",
      category: "computer science",
      hours: 56,
      price: 999,
      image: '/images/p1.jpg',
      numberofpurchase: 10,
      rating: 4.5,
      numReviews: 5,
      Instructor: "Arnav Sharma",
      description: 'React,firebase,Redux comes together to create this beautiful Netflix clone',
    },
    {
      id: 2,
      name: "3D Earth - WebGl in action",
      category: "Physics",
      hours: 50,
      price: 199,
      image: '/images/p1.jpg',
      numberofpurchase: 8,
      rating: 4.1,
      numReviews: 2,
      Instructor: "Sumit Kumar",
      description: 'Using WebG',
    },
    {
      id: 3,
      name: "Build a fullstack Netflix Clone",
      category: "computer science",
      hours: 56,
      price: 999,
      image: '/images/p1.jpg',
      numberofpurchase: 10,
      rating: 4.5,
      numReviews: 5,
      Instructor: "Arnav Sharma",
      description: 'React,firebase,Redux comes together to create this beautiful Netflix clone',
    },
    {
      id: 4,
      name: "Build a fullstack Netflix Clone",
      category: "computer science",
      hours: 56,
      price: 999,
      image: '/images/p1.jpg',
      numberofpurchase: 10,
      rating: 4.5,
      numReviews: 5,
      Instructor: "Arnav Sharma",
      description: 'React,firebase,Redux comes together to create this beautiful Netflix clone',
    },
  ]
}

function App() {
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="">
                <Navbar.Brand>Edemy</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Mycontext.Provider value={{ data }}>
            <Routes>
              <Route path='/course/:id' element={<CourseScreen />} />
              <Route path='/' element={<HomeScreen />} />
            </Routes>
          </Mycontext.Provider>
        </main>
        <footer>
          <div className='text-center'>All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
