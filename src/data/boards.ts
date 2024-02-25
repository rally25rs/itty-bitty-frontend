import { Image } from './images';

export interface Board {
    id: number;
    name: string;
    displayImage: string;
    images: Image[];
}

// fetch('http://localhost:3000/api/boards')


export const getBoards = () => {
    const boards = fetch('http://localhost:3000/api/boards')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return boards;
}

export const getBoard = (id: number) => {
    const board = fetch(`http://localhost:3000/api/boards/${id}`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return board;
}