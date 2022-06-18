import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom'
import { Store } from '../Store'

export default function ProtectedRoute({ children }) {

    const { state } = useContext(Store);
    const { userInfo } = state;
    return userInfo ? children : <Navigate to="/signin" />
}

ProtectedRoute.propTypes = {
    children: PropTypes.any
}