import React, { useState } from 'react'
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import Popup from './Popup';

export default function LectureDropdown(props) {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <div className="d-grid gap-2 mb-1">
                <Button variant="primary" size="lg" onClick={togglePopup} className="button-content">
                    {props.id} {props.name}
                </Button>
            </div>
            {isOpen && <Popup
                link={props.link}
                handleClose={togglePopup}
            />}
        </div>
    )
}

LectureDropdown.propTypes = {
    id: PropTypes.number,
    link: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.any
};
