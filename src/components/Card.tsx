import { Card as CardType} from "@/app/actions/boardActions";
import Options from "./options/Options";

type CardProps = {
    card: CardType;
    boardId: string;
    onDelete: (cardId: string) => Promise<void>;
}

export default function Card({ boardId, card, onDelete } : CardProps) {

    async function handleDelete(){
        if (typeof onDelete !== 'function') {
            console.error("onDelete prop is not a function:", onDelete);
            return;
        }
        await onDelete(card.id);
    }

    async function handleEdit(){
        // TO-DO: Implement redirecting to open the card menu
    }

    return (
        <div className="flex items-center justify-between border bg-white my-2 p-3 rounded-md">
            <span className="flex-auto">{card.title}</span>
            <Options boardId={boardId} onEdit={() => handleEdit()} onDelete={handleDelete}/>
        </div>
    );
}