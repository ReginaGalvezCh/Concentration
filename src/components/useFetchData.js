import { useState, useEffect } from 'react';

export default function useFetchData(cardAmount, setGame) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong while fetching the data!');
                }
                return response.json();
            })
            .then(data => {
                const cards = data.entries.slice(0, cardAmount).map((item, index) => ({
                    id: 'card-' + index,
                    img: item.fields.image.url,
                    isFlipped: true,
                    isMatched: false
                }));
                const duplicateCards = cards.map((card, index) => ({ ...card, id: 'duplicateCard-' + index }));
                const gameCards = [...cards, ...duplicateCards].sort(() => Math.random() - 0.5);
                setGame(prevGame => ({ ...prevGame, cards: gameCards }));
                setIsLoading(false);

                setTimeout(() => {
                    setGame(prevGame => {
                        const newCards = prevGame.cards.map(card => ({ ...card, isFlipped: false }));
                        return { ...prevGame, cards: newCards };
                    });
                }, 10000);
            })
            .catch(error => {
                setIsLoading(false);
                setError(error.message);
            });
    }, [cardAmount, setGame]);

    return { isLoading, error };
}
