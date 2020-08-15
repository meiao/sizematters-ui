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

export interface UserIdRoom {
  room_name: string;
  user_id: string;
}

export interface UserRoom {
  room_name: string;
  user: UserData;
}

export interface OwnVote {
  room_name: string;
  size: number;
}

export class BoxedNumber {
  num: number;

  constructor() {
    this.num = -1;
  }
}

export interface VoteResults {
  room_name: string;
  votes: Record<string, number>;
}

export interface RoomName {
  room_name: string;
}
