import React, { useState, useEffect } from 'react';
import './Game.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useWindowSize from './useWindowSize';
import useFetchData from './useFetchData';
import useGameLogic from './useGameLogic';

function Game() {
    function calculateCardAmount(windowSize) {
        if (windowSize < 600 ) return 6;
        if (windowSize < 900 ) return 12;
        return 18; 
   }
   const windowSize = useWindowSize();
    const cardAmount = calculateCardAmount(windowSize);

    const [game, setGame] = useState({
        userName: "",
        cards: [],
        flippedCards: [],
        matchedCards: [],
        mistakes: 0,
        matches: 0,
        gameWon: false,
        showModal: !localStorage.getItem('userName'),
        tempUserName: ""
    });

    const { isLoading, error } = useFetchData(cardAmount, setGame);
    useGameLogic(game, setGame);

    const [newUserName, setNewUserName] = useState("");
    const [isUserConfirmed, setIsUserConfirmed] = useState(false);

    const confirmUser = (event) => {
        event.preventDefault(); 
        localStorage.setItem('userName', newUserName);
        setGame(prevGame => ({ ...prevGame, userName: newUserName }));
        setIsUserConfirmed(true);
    };

    const handleNameChange = (event) => {
        setNewUserName(event.target.value);
    };

    const handleCardClick = (id) => {
        const clickedCardIndex = game.cards.findIndex(card => card.id === id);
        const clickedCard = game.cards[clickedCardIndex];

        if (clickedCard.isFlipped || clickedCard.isMatched) {
            return;
        }

        const newCards = [...game.cards];
        newCards[clickedCardIndex] = { ...newCards[clickedCardIndex], isFlipped: true };

        setGame(prevGame => ({
            ...prevGame,
            cards: newCards,
            flippedCards: [...prevGame.flippedCards, newCards[clickedCardIndex]]
        }));
    };

    if (isLoading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Modal show={!isUserConfirmed} onHide={() => setIsUserConfirmed(true)}>  
                <Modal.Header>
                    <Modal.Title>Welcome to the game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={confirmUser}>  
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Please enter your name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={newUserName} onChange={handleNameChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">  
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="container-fluid game-container">
                <div className="row stats-container">
                    <div className="col">Matches: {game.matches}</div>
                    <div className="col">Mistakes: {game.mistakes}</div>
                </div>
                <div className="row row-cols-2 row-cols-md-6 row-cols-lg-6 g-5 cards-container">
                    {game.cards.map(card => (
                        <div className="col" key={card.id}>
                            <div
                                onClick={() => handleCardClick(card.id)}
                                className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                            >
                                <img className="card-image" src={card.img} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
                {game.gameWon && <div className="congrats-message">Congratulations, you won the game!</div>}
            </div>
        </>
    );
}
export default Game;
