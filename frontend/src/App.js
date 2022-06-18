import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
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
import OrderScreen from './pages/OrderScreen';
import OrderHistoryScreen from './pages/OrderHistoryScreen';
import ProfileScreen from './pages/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils/utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './pages/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './pages/DashboardScreen';
import AdminRoute from './components/AdminRoute';
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
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/courses/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div className={sidebarIsOpen
        ? 'd-flex flex-column site-container active-cont'
        : 'd-flex flex-column site-container'
      }
      >
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button variant='dark' onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                <i className='fas fa-bars'></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Edemy</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
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

                  {userInfo && userInfo.isAdmin && (
                    <NavDropDown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropDown.Item>Dashboard</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropDown.Item>Products</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropDown.Item>Orders</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropDown.Item>Users</NavDropDown.Item>
                      </LinkContainer>
                    </NavDropDown>

                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div className={sidebarIsOpen ?
          'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
          : 'side-navbar dflex justify-content-between flex-wrap flex-column'
        }
        >
          <Nav className='flex-column text-white w-100 p-2'>
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}>
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>

        </div>

        <main>
          <Mycontext.Provider value={{ data }}>
            <Routes>
              <Route path='/course/:name' element={<CourseScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/search' element={<SearchScreen />} />
              <Route path='/signin' element={<SigninScreen />} />
              <Route path='/signup' element={<SignupScreen />} />
              <Route path='/address' element={<AddressScreen />} />
              <Route path='/payment' element={<PaymentMethodScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/orders/:id' element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
              <Route path='/orderhistory' element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />

              <Route path='/profile' element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path='/admin/dashboard' element={<AdminRoute><DashboardScreen /></AdminRoute>} />
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
