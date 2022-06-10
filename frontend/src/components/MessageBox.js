import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import React from 'react';

export default function MessageBox(props) {
    const { variant, error } = props;
    return (
        <Alert variant={variant || 'info'}>{error}</Alert>
    );
}

MessageBox.propTypes = {
    variant: PropTypes.string,
    error: PropTypes.string,
};