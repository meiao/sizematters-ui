export interface UserData {
  user_id: string;
  name: string;
  gravatar_id: string;
}

export interface RoomStatus {
  room_name: string;
  users: UserData[];
  votes_cast: number;
}

export interface UserLeft {
  room_name: string;
  user_id: string;
}

export interface UserEntered {
  room_name: string;
  user: UserData;
}