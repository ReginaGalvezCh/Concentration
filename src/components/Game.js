import React, { useState, useEffect } from 'react';

function Game() {
    const [game, setGame] = useState({
        userName: "",
        cards: [],
        flippedCards: [],
        matchedCards: [],
        mistakes: 0,
        matches: 0,
        gameWon: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        // Check if there is a username in local storage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            // If there is, use it
            setGame(prevGame => ({ ...prevGame, userName: storedUserName }));
        } else {
            // If there isn't, ask the user for their name
            const userName = prompt('Please enter your name');
            setGame(prevGame => ({ ...prevGame, userName }));
            // And store it in local storage for future use
            localStorage.setItem('userName', userName);
        }

        // Fetch data from the API...
    }, []);

    // Whenever the userName changes, update it in local storage
    useEffect(() => {
        localStorage.setItem('userName', game.userName);
    }, [game.userName]);

    useEffect(() => {
        setIsLoading(true);
        fetch('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong while fetching the data!');
                }
                return response.json();
            })
            .then(data => {
                const cards = data.map(item => ({
                    id: item.id,
                    img: item.img,
                    isFlipped: false,
                    isMatched: false
                }));
                const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
                setGame(prevGame => ({ ...prevGame, cards: gameCards }));
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                setError(error.message);
            });
    }, []);
    const handleCardClick = (id) => {
        const clickedCardIndex = game.cards.findIndex(card => card.id === id);
    const clickedCard = game.cards[clickedCardIndex];

    if (clickedCard.isFlipped || clickedCard.isMatched) {
        // The card is already flipped or matched, so don't do anything
        return;
    }

    const newCards = [...game.cards];
    newCards[clickedCardIndex] = { ...newCards[clickedCardIndex], isFlipped: true };

    setGame(prevGame => ({
        ...prevGame,
        cards: newCards,
        flippedCards: [...prevGame.flippedCards, id]
    }));

    };
    useEffect(() => {
        if (game.flippedCards.length === 2) {
            const [card1, card2] = game.flippedCards.map(id => game.cards.find(card => card.id === id));
            if (card1.img === card2.img) {
                setGame(prevGame => ({
                    ...prevGame,
                    matchedCards: [...prevGame.matchedCards, card1.id, card2.id],
                    matches: prevGame.matches + 1,
                    flippedCards: []
                }));
            } else {
                setTimeout(() => {
                    const newCards = [...game.cards];
                    const card1Index = newCards.findIndex(card => card.id === card1.id);
                    const card2Index = newCards.findIndex(card => card.id === card2.id);

                    newCards[card1Index] = { ...newCards[card1Index], isFlipped: false };
                    newCards[card2Index] = { ...newCards[card2Index], isFlipped: false };

                    setGame(prevGame => ({
                        ...prevGame,
                        cards: newCards,
                        mistakes: prevGame.mistakes + 1,
                        flippedCards: []
                    }));
                }, 1000);
            }
        }
    }, [game.flippedCards]);

    useEffect(() => {
        if (game.matchedCards.length === game.cards.length) {
            setGame(prevGame => ({ ...prevGame, gameWon: true }));
        }
    }, [game.matchedCards, game.cards]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {game.cards.map(card => (
                <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                >
                    <img src={card.img} alt="" />
                </div>
            ))}
            {game.gameWon && <div>Congratulations, you won the game!</div>}
        </div>
    );
}

export default Game;
