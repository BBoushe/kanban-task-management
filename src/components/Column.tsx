import { ReactSortable } from "react-sortablejs";
import { CardType } from "./Board";
import { SetStateAction } from "react";

// this is called type alias and is used to define the shape or the data types of the props in the component
// you can use an interface here as well, but using type alias is not only common practice but also offers more flexibility because of
// the ability to define complex types like union or intersection and also serve a specific puspose
// interfaces can be inherited while types cannot 
type ColumnProps = {
    id: string;
    name: string;
    idx: number;
    cards: CardType[];
    setCards: SetStateAction<any>;
}

export default function Column({ id, name, cards, setCards }: ColumnProps) {
    function setCardsForColumn(sortedCards: CardType[], newColumnId: string) {
        setCards((prevCards: CardType[]) => {
            const unsortedCards = [...prevCards]; // destruct with spread and give us the prev state
            
            sortedCards.forEach((sortedCard: CardType, newOrder: number) => {
                const foundCard = unsortedCards.find((card) => card.id === sortedCard.id)
                if(foundCard) {
                    foundCard.columnId = newColumnId;
                    foundCard.order = newOrder; // update the new position
                }
            });
            
            return unsortedCards.sort((a,b) => {
                if(a.columnId === b.columnId) {
                    return a.order - b.order;
                }
                return 0;
            });
            // return the new processed cards, sorted by order so the reordering works, as the new state of the cards
            // which is being called when anythin in the ReactSortable changes, specifically on the list of cards 
        });
    }

    return (
        <div className="w-48 shadow-md bg-white rounded-md p-4">
            <h3>{name}</h3>
            <ReactSortable 
                list={cards} 
                setList={(updatedCards) => setCardsForColumn(updatedCards, id)} 
                group="cards"
                className="min-h-32 p-1 flex flex-col space-y-1"
                ghostClass="opacity-30"
            >
                {cards.map(card => (
                    <div key={card.id} className="border bg-white my-2 p-4 rounded-md">
                        <span>{card.name}</span>
                    </div>
                ))}
            </ReactSortable>
        </div>
    );
}