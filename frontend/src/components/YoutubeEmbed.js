import React from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = (props) => (
    <div className="video-responsive">
        <iframe
            width="200"
            height="200"
            src={`https://www.youtube.com/embed/${props.link}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
);

YoutubeEmbed.propTypes = {
    link: PropTypes.string,
    children: PropTypes.any
};

export default YoutubeEmbed;