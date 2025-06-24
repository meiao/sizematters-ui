export interface UserData {
  user_id: string;
  name: string;
  gravatar_id: string;
  active: boolean;
}

export interface Scale {
  name: string;
  displayName: string;
  values: string[];
}

export class RoomStatus {
  room_name: string;
  hashed_password: string;
  users: UserData[];
  votes_cast: number;
  selected_user: string;
  scale_values: Map<string, Scale>;
  selected_scale_name: string;
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

export class Vote {
  value: number | undefined;
  hasVoted: boolean;

  constructor() {
    this.hasVoted = false;
    this.value = undefined;
  }
}

export interface VoteResults {
  room_name: string;
  votes: Record<string, number>;
}

export interface RoomData {
  room_name: string;
  selected_user_id: string;
  selected_scale: Scale;
}

export class BoxedValue<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}
