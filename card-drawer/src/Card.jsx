import React from "react";
import "./Card.css";

const Card = ({imageUrl, value, suit}) => {
  return (
    <div className="Card">
      <img className="Card-image" src={imageUrl} alt={`Current card: ${value} of ${suit}`} />
    </div>
  );
};

export default Card;