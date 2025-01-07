import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card.jsx";

const CardDrawer = () => {
  const [deckId, setDeckId] = useState("");
  const [currentCard, setCurrentCard] = useState(null);
  const [anyCardsLeft, setAnyCardsLeft] = useState(true);

  useEffect(() => {
    async function getNewDeck() {
      const res = await axios.get("https://deckofcardsapi.com/api/deck/new");
      console.log(res);
      setDeckId(res.deck_id);
    }
  }, []);

  //only calls the Deck of Cards API for a new card if there are still cards waiting to be drawn in the deck.
  const drawCard = async () => {
    if (anyCardsLeft) {
      const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw?count=1`);
      console.log(res);
      setCurrentCard(card => ({
        imageUrl: res.cards[0].image,
        value: res.cards[0].value,
        suit: res.cards[0].suit
      }));
      if (res.remaining === 0) {
        setAnyCardsLeft(false);
      }
    }
  };

  return (
    <div className="CardDrawer">
      {
        deckId ? 
        (
          <div>
            <button className="CardDrawer-draw-button" onClick={drawCard}>DRAW CARD</button>
            {currentCard ? <Card imageUrl={currentCard.imageUrl} value={currentCard.value} suit={currentCard.suit}/> 
            : <p className="CardDrawer-prompt">Press the button to draw a card!</p>}
            {!anyCardsLeft && <p>ERROR: No cards remaining!</p>}
          </div>
        ) 
        : <h2 className="CardDrawer-loader">Loading Cards...</h2>
      }
    </div>
  );
};

export default CardDrawer;