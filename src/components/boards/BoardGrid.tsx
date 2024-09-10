import { createRef, useEffect, useState } from "react";
import { Board } from "../../data/boards";
import { IonButton } from "@ionic/react";
import BoardGridItem from "./BoardGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { deleteChildBoard } from "../../data/child_boards";

interface BoardGridProps {
  boards: Board[];
  gridType?: string;
  loadBoards?: any;
}
const BoardGrid = ({ boards, gridType, loadBoards }: BoardGridProps) => {
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();
  const [currentBoards, setCurrentBoards] = useState<Board[]>(boards);

  const handleRemoveBoard = async (board: Board) => {
    console.log("remove board", board);
    console.log("gridType", gridType);
    if (!board) return;
    if (currentUser && gridType === "child") {
      try {
        await deleteChildBoard(board.id);
        const updatedBoards = boards.filter((b) => b.id !== board.id);
        setCurrentBoards(updatedBoards);
        console.log("updatedBoards", updatedBoards);
      } catch (error) {
        console.error("Error removing board: ", error);
        alert("Error removing board");
      }
    }
  };

  useEffect(() => {
    console.log("Grid type", gridType);
    if (loadBoards) {
      loadBoards();
    }
  }, [currentBoards]);

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-3"
        ref={gridRef}
      >
        {boards &&
          boards.map((board, i) => (
            <div
              id={board.id}
              className="rounded-md flex relative p-2"
              key={board.id}
            >
              <BoardGridItem
                board={board}
                gridType={gridType}
                showRemoveBtn={
                  currentUser && gridType === "child" ? true : false
                }
                removeChildBoard={handleRemoveBoard}
              />
            </div>
          ))}
      </div>
      {currentUser && boards?.length === 0 && (
        <div className="w-full mx-auto text-center">
          <p className="text-lg">No boards found</p>
          <p className="text-sm">Create a new board to get started</p>
        </div>
      )}
    </>
  );
};

export default BoardGrid;
