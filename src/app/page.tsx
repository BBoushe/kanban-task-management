import Board from "@/components/Board";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function Home() {
  return (
    <ProtectedRoute>
      <div className="p-4">
        <Board/>
      </div>
    </ProtectedRoute>
  );
}
