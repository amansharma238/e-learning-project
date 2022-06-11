import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import React from 'react';

export default function MessageBox(props) {
    return (
        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
    );
}

MessageBox.propTypes = {
    variant: PropTypes.string,
    children: PropTypes.any
};