import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card.jsx";

const CardDrawer = () => {
  const [deckId, setDeckId] = useState(0);
  const [currentCardImage, setCurrentCardImage] = useState("");

  useEffect(() => {
    async function getNewDeck() {
      const res = await axios.get("https://deckofcardsapi.com/api/deck/new");
      setDeckId(res.deck_id);
    }
  }, []);

  return (
    <div className="CardDrawer">
      {
        deckId ? 
        (
          <div>
            <button className="CardDrawer-draw-button" onClick={drawCard}>DRAW CARD</button>
            {currentCardImage ? <Card/> : <p className="CardDrawer-prompt">Press the button to draw a card!</p>}
          </div>
        ) 
        : <h2 className="CardDrawer-loader">Loading Cards...</h2>
      }
    </div>
  );
};

export default CardDrawer;