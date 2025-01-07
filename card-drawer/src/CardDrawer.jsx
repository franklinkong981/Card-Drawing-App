import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {v4 as uuid} from "uuid";

import Card from "./Card.jsx";

const CardDrawer = () => {
  const [deckId, setDeckId] = useState("");
  const [cards, setCards] = useState([]);
  const [anyCardsLeft, setAnyCardsLeft] = useState(true);

  //initially, get a new deck of cards and shuffle the cards.
  useEffect(() => {
    async function getNewDeck() {
      const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=1");
      setDeckId(res.data.deck_id);
    }
    getNewDeck();
  }, []);

  //only calls the Deck of Cards API for a new card if there are still cards waiting to be drawn in the deck.
  const drawCard = async () => {
    if (anyCardsLeft) {
      const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw?count=1`);
      if (res.data.cards.length === 0) {
        setAnyCardsLeft(false);
      }
      else {
        setCards(cards => ([
          ...cards,
          {
            id: uuid(),
            imageUrl: res.data.cards[0].image,
            value: res.data.cards[0].value,
            suit: res.data.cards[0].suit
          }
        ]));
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
            {cards.length ? (
              <div className="CardDrawer-cards">
                {cards.map((card) => <Card key={card.id} imageUrl={card.imageUrl} value={card.value} suit={card.suit}/>)}
              </div> 
            ) : <p className="CardDrawer-prompt">Press the button to draw a card!</p>}
            {!anyCardsLeft && <p className="CardDrawer-error-message">ERROR: No cards remaining!</p>}
          </div>
        ) : <h2 className="CardDrawer-loader">Loading Cards...</h2>
      }
    </div>
  );
};

export default CardDrawer;