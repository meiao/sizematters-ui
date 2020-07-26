export interface UserData {
  user_id: string;
  name: string;
  gravatar_id: string;
}

export interface RoomJoined {
  room_name: string;
  users: UserData[];
}