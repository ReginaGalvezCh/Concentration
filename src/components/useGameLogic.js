import { useEffect } from 'react';

export default function useGameLogic(game, setGame) {
    useEffect(() => {
        if (game.flippedCards.length === 2) {
            const [card1, card2] = game.flippedCards;

            if (card1.img === card2.img) {
                setGame(prevGame => ({
                    ...prevGame,
                    matchedCards: [...prevGame.matchedCards, card1, card2],
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
    }, [game.flippedCards, game.cards, setGame]);

    useEffect(() => {
        if (game.cards.length > 0 && game.matchedCards.length === game.cards.length / 2) {
            setGame(prevGame => ({ ...prevGame, gameWon: true }));
        }
    }, [game.matchedCards, game.cards, setGame]);
}
