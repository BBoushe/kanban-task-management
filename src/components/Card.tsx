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
        <div className="flex items-start justify-between border bg-white p-3 rounded-md shadow hover:bg-gray-50">
            <span className="flex-auto break-words">{card.title}</span>
            <Options boardId={boardId} onEdit={() => handleEdit()} onDelete={handleDelete}/>
        </div>
    );
}