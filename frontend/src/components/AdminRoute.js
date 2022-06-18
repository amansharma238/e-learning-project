import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom'
import { Store } from '../Store'

export default function AdminRoute({ children }) {

    const { state } = useContext(Store);
    const { userInfo } = state;
    return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />
}

AdminRoute.propTypes = {
    children: PropTypes.any
}