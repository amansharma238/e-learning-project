import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import CourseScreen from './pages/CourseScreen';
import HomeScreen from './pages/HomeScreen';
import Mycontext from './context';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropDown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import CartScreen from './pages/CartScreen';
import { Link } from 'react-router-dom';
import SigninScreen from './pages/SigninScreen';
import AddressScreen from './pages/AddressScreen';
import SignupScreen from './pages/SignupScreen';
import PaymentMethodScreen from './pages/PaymentMethodScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
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
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('Address');
    localStorage.removeItem('paymentMethod');
  }


  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg="dark" variant="dark">
            <Container className='mb-3'>
              <LinkContainer to="">
                <Navbar.Brand>Edemy</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className='nav-link'>
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropDown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropDown.Item>User Profile</NavDropDown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropDown.Item>Order history</NavDropDown.Item>
                    </LinkContainer>
                    <NavDropDown.Divider />
                    <Link className='dropdown-item' to='#signout' onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </NavDropDown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )
                }
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Mycontext.Provider value={{ data }}>
            <Routes>
              <Route path='/course/:name' element={<CourseScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/signin' element={<SigninScreen />} />
              <Route path='/signup' element={<SignupScreen />} />
              <Route path='/address' element={<AddressScreen />} />
              <Route path='/payment' element={<PaymentMethodScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
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
