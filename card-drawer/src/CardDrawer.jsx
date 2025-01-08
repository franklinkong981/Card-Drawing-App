import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {v4 as uuid} from "uuid";

import Card from "./Card.jsx";
import "./CardDrawer.css";

const CardDrawer = () => {
  const [deckId, setDeckId] = useState("");
  const [cards, setCards] = useState([]);
  const [anyCardsLeft, setAnyCardsLeft] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);

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
      } else {
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

  //Pressing the "Start Drawing" button sets isDrawing to True, which triggers useEffect which starts the 1-second interval for drawCard.
  //Pressing the "Stop Drawing" button sets isDrawing to false, which triggers useEffect which stops the timer.
  const toggleDrawing = () => {
    setIsDrawing(isDrawing => !isDrawing);
  };

  //timerId.current starts out as undefined.
  const timerId = useRef();

  useEffect(() => {
    async function handleDrawing() {
      if (isDrawing) {
        timerId.current = setInterval(async () => {
          await drawCard();
        }, 1000);
      } else {
        clearInterval(timerId.current);
      }
    }
    handleDrawing();

    return () => clearInterval(timerId.current);
  }, [isDrawing]);

  //Generates a new shuffled deck of cards and clears all the cards currently on the page.
  const getNewDeck = async () => {
    async function getNewDeck() {
      const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=1");
      setDeckId(deckId => res.data.deck_id);
    }
    getNewDeck();

    setCards(cards => []);
    setAnyCardsLeft(anyCardsLeft => true);
    setIsDrawing(isDrawing => false);
  };

  return (
    <div className="CardDrawer">
      {
        deckId ? 
        (
          <div>
            {!anyCardsLeft && <p className="CardDrawer-error-message">ERROR: No cards remaining!</p>}
            <button className="CardDrawer-draw-button" style={isDrawing ? {backgroundColor: "red"} : {backgroundColor: "green"}} onClick={toggleDrawing}>
              {isDrawing ? "Stop drawing" : "Start drawing"}
            </button>
            {cards.length ? <button className="CardDrawer-new-deck-button" onClick={getNewDeck}>NEW DECK</button> : null}
            {cards.length ? (
              <div className="CardDrawer-cards">
                {cards.map((card) => <Card key={card.id} imageUrl={card.imageUrl} value={card.value} suit={card.suit}/>)}
              </div> 
            ) : <p className="CardDrawer-prompt">Press the button to draw a card!</p>}
          </div>
        ) : <h2 className="CardDrawer-loader">Loading Cards...</h2>
      }
    </div>
  );
};

export default CardDrawer;