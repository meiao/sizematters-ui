export interface UserData {
  user_id: string;
  name: string;
  gravatar_id: string;
}

export class RoomStatus {
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

export interface UserVote {
  room_name: string;
  size: number;
}

export class BoxedNumber {
  num: number;

  constructor() {
    this.num = -1;
  }
}
