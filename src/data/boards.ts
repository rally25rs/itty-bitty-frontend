import { Image } from "./images";
import { BASE_URL, userHeaders } from "./constants";

export interface Board {
  id?: string;
  name: string;
  description?: string;
  predefined?: boolean;
  parent_type?: string;
  display_image_url?: string | null;
  number_of_columns: number;
  images?: Image[];
  error?: string;
  floating_words?: string[];
  voice?: string;
  can_edit?: boolean;
  can_delete?: boolean;
  cost?: number;
  status?: string;
  token_limit?: number;
  has_generating_images?: boolean;
  user_id?: string;
  layout?: any;
}

export interface PredictiveBoard {
  id: string;
  name: string;
  description: string;
  number_of_columns: number;
  images: Image[];
}

export const getBoards = () => {
  const boards = fetch(`${BASE_URL}boards`, { headers: userHeaders }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

// export const updateGridSize = (id: string, size: number) => {
//     const updatedBoard = fetch(`${BASE_URL}boards/${id}/update_grid_size`, {
//         method: 'PUT',
//         headers: userHeaders,
//         body: JSON.stringify({ number_of_columns: size }),
//     })
//         .then(response => response.json())
//         .then(data => data)
//         .catch(error => console.error('Error updating board: ', error));

//     return updatedBoard;
// }

export const saveLayout = (id: string, layout: any) => {
  const updatedBoard = fetch(`${BASE_URL}boards/${id}/save_layout`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ layout }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoard;
};

export const rearrangeImages = (id: string) => {
  const updatedBoard = fetch(`${BASE_URL}boards/${id}/rearrange_images`, {
    method: "POST",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoard;
};

export const getUserBoards = () => {
  const boards = fetch(`${BASE_URL}boards/user_boards`, {
    headers: userHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export const getBoard = (id: string) => {
  const board = fetch(`${BASE_URL}boards/${id}`, { headers: userHeaders }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return board;
};

export const getInitialImages = () => {
  const board = fetch(`${BASE_URL}boards/first_predictive_board`, {
    headers: userHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return board;
};

export const createBoard = (board: Board, word_list?: string[]) => {
  const payload = {
    board: {
      name: board.name,
      description: board.description || "",
      number_of_columns: board.number_of_columns,
    },
    word_list,
  };
  const newBoard = fetch(`${BASE_URL}boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error creating board: ", error));

  return newBoard;
};

export const updateBoard = (board: Board) => {
  const updatedBoard = fetch(`${BASE_URL}boards/${board.id}`, {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify(board),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoard;
};

export const deleteBoard = (id: string) => {
  const result = fetch(`${BASE_URL}boards/${id}`, {
    method: "DELETE",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error deleting board: ", error));

  return result;
};

export async function addImageListToBoard(
  id: string,
  payload: { word_list: string[] }
): Promise<Board> {
  const requestInfo = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/add_word_list`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function getRemainingImages(
  id: string,
  page: number,
  query: string
): Promise<Image[]> {
  let strPage = page.toString();
  if (query && query.length > 0) {
    strPage = "";
  }
  const response = await fetch(
    `${BASE_URL}boards/${id}/remaining_images?page=${strPage}&query=${query}`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export async function addImageToBoard(
  id: string,
  image_id: string
): Promise<any> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ image_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/associate_image`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function removeImageFromBoard(
  id: string,
  image_id: string
): Promise<Board> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ image_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/remove_image`,
    requestInfo
  );
  const board: Board = await response.json();
  console.log("removeImageFromBoard", board);
  return board;
}

export async function addToTeam(id: string, team_id: string): Promise<any> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ team_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/add_to_team`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function removeFromTeam(
  id: string,
  team_id: string
): Promise<any> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ team_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/remove_from_team`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function cloneBoard(id: string): Promise<Board> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
  };
  const response = await fetch(`${BASE_URL}boards/${id}/clone`, requestInfo);
  const board: Board = await response.json();
  return board;
}
