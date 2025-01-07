import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card.jsx";

const CardDrawer = () => {
  const [deckId, setDeckId] = useState(0);
  const [currentCardImage, setCurrentCardImage] = useState("");

  return (
    <div className="Card-Drawer">
      {
        deckId ? 
        (
          <div>
            <button>DRAW CARD</button>
            <Card />
          </div>
        ) 
        : <h2 className="Card-Drawer-loader">Loading Cards...</h2>
      }
    </div>
  );
};

export default CardDrawer;