import React, { useEffect, useState, useRef } from 'react';
import { Board, deleteBoard, getBoards } from '../data/boards';
import { IonList, IonButton, IonItem } from '@ionic/react';
// import '../index.css'
import BoardListItem from './BoardListItem';
import { useHistory } from 'react-router';
import ActionList from './ActionList';
// import { User, getCurrentUser, isUserSignedIn } from '../data/users';
import SignInScreen from '../pages/SignUpScreen';
import { useCurrentUser } from '../hooks/useCurrentUser';
const BoardList = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [boardId, setBoardId] = useState<string>('');
    const [leaving, setLeaving] = useState<boolean>(false);
    const { currentUser, setCurrentUser } = useCurrentUser();

    const fetchBoards = async () => {
        const allBoards = await getBoards();
        if (!allBoards) {
            console.error('Error fetching boards');
            return;
        }
        const boards = allBoards['boards']
        setBoards(boards);
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    const history = useHistory();

    const handleBoardClick = (board: Board) => {
        console.log('Board clicked: ', board.id);
        // history.push(`/boards/${board.id}`);
        setBoardId(board.id as string);
    }

    return (
        <div className="w-full p-2">
            <IonList className="w-full">
                {boards && boards.map((board, i) => (
                    <IonItem key={i}>
                        <div id={board.id} className='rounded-md flex relative w-full hover:cursor-pointer text-center' onClick={() => handleBoardClick(board)} key={board.id}>
                            <BoardListItem board={board} />
                        </div>
                    </IonItem>
                ))}
                {currentUser && boards?.length === 0 &&
                    <div className="text-center">
                        <p>No boards found</p>
                        <IonButton routerLink="/boards/new" color="primary">Create a new board</IonButton>
                    </div>}

                {!currentUser && <SignInScreen />}
            </IonList>
        </div>
    );
};

export default BoardList;
