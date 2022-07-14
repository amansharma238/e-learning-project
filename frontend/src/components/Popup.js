import React from 'react'
import PropTypes from "prop-types";
import Card from 'react-bootstrap/Card';
import YoutubeEmbed from "../components/YoutubeEmbed";
export default function Popup(props) {
  return (
    <div className="popup-box">
      <Card className="box">
        <span className="close-icon" onClick={props.handleClose}>X</span>
        <Card.Body>
          <YoutubeEmbed link={props.link} />
        </Card.Body>
      </Card>
    </div>
  )
}

Popup.propTypes = {
  link: PropTypes.string,
  handleClose: PropTypes.bool,
  children: PropTypes.any
};