import Vue from "vue";
import {
  RoomStatus,
  UserData,
  UserLeft,
  UserEntered,
  UserVote,
  BoxedNumber
} from "./data";

const eventBus = new Vue();

let socket: WebSocket;

let userId: string;
const userVotes: Map<string, BoxedNumber> = new Map();
const rooms: RoomStatus[] = [];
const roomMap: Map<string, RoomStatus> = new Map();
const users: Map<string, UserData> = new Map();

function getRoom(roomName: string): RoomStatus {
  let room = roomMap.get(roomName);
  if (room === undefined) {
    room = new RoomStatus();
    roomMap.set(roomName, room);
  }
  return room;
}

function userUpdated(updatedUser: UserData) {
  const user = users.get(updatedUser.user_id);
  if (user === undefined) {
    users.set(updatedUser.user_id, updatedUser);
  } else {
    // eslint-disable-next-line
    user.gravatar_id = updatedUser.gravatar_id;
    user.name = updatedUser.name;
  }
}

function userData(userData: UserData) {
  userId = userData.user_id;
  userUpdated(userData);
}

function getVote(roomName: string): BoxedNumber {
  let vote = userVotes.get(roomName);
  if (vote === undefined) {
    vote = new BoxedNumber();
    userVotes.set(roomName, vote);
  }
  return vote;
}

function userVote(userVote: UserVote) {
  const vote = getVote(userVote.room_name);
  vote.num = userVote.size;
}

function roomJoined(roomStatus: RoomStatus) {
  roomMap.set(roomStatus.room_name, roomStatus);
  roomStatus.users.forEach(user => userUpdated(user));
  rooms.push(roomStatus);
}

function userEntered(userEntered: UserEntered) {
  userUpdated(userEntered.user);
  const room = roomMap.get(userEntered.room_name);
  if (room !== undefined) {
    const usersInRoom = room.users;
    usersInRoom.push(userEntered.user);
  }
}

function userLeft(userLeft: UserLeft) {
  const roomName = userLeft.room_name;
  if (userLeft.user_id == userId) {
    const room = roomMap.get(roomName);
    roomMap.delete(roomName);
    userVotes.delete(roomName);
    if (room !== undefined) {
      const index = rooms.indexOf(room);
      if (index > -1) {
        rooms.splice(index, 1);
      }
    }
  } else {
    const room = roomMap.get(roomName);
    if (room !== undefined) {
      const usersInRoom = room.users;
      const index = usersInRoom.findIndex(x => x.user_id == userLeft.user_id);
      if (index !== undefined && index > -1) {
        usersInRoom.splice(index, 1);
      }
    }
  }
}

function votesCast(roomName: string, votesCast: number) {
  const room = getRoom(roomName);
  // eslint-disable-next-line
  room.votes_cast = votesCast;
}

function newVote(roomName: string) {
  const vote = getVote(roomName);
  vote.num = -1;
  // eslint-disable-next-line
  getRoom(roomName).votes_cast = 0;
}

function processMessage(msg: MessageEvent) {
  const data = JSON.parse(msg.data);
  eventBus.$emit(data.type, data.data);
  switch (data.type) {
    case "RoomJoined":
      roomJoined(data.data);
      break;
    case "UserLeft":
      userLeft(data.data);
      break;
    case "UserEntered":
      userEntered(data.data);
      break;
    case "UserUpdated":
      userUpdated(data.data.user);
      break;
    case "UserVote":
      userVote(data.data);
      break;
    case "VotesCast":
      votesCast(data.data.room_name, data.data.votes_cast);
      break;
    case "NewVote":
      newVote(data.data.room_name);
      break;
    case "UserData":
      userData(data.data.user);
      break;
    default:
      console.log("message not handled:" + data.type);
  }
}

function sendMessage(type: string, content) {
  const message = {};
  message["type"] = type;
  message["data"] = content;
  const msg = JSON.stringify(message);
  socket.send(msg);
}

function checkConnection(successCallback: Function, failureCallback: Function) {
  if (socket.readyState == WebSocket.OPEN) {
    successCallback();
  } else if (socket.readyState == WebSocket.CONNECTING) {
    setTimeout(() => checkConnection(successCallback, failureCallback), 250);
  } else {
    failureCallback();
  }
}

const connectionError = "connectionError";

export default {
  connectionError,

  isConnected(): boolean {
    return socket !== undefined && socket.readyState === WebSocket.OPEN;
  },

  connect(successCallback: Function, failureCallback: Function) {
    socket = new WebSocket("ws://localhost:9001");
    socket.onmessage = msg => processMessage(msg);
    checkConnection(successCallback, failureCallback);
  },

  joinRoom(roomName: string, password: string) {
    // eslint-disable-next-line
    sendMessage("JoinRoom", { "room_name": roomName, "password": password });
  },

  leaveRoom(roomName: string) {
    // eslint-disable-next-line
    sendMessage("LeaveRoom", { "room_name": roomName });
  },

  vote(roomName: string, size: number) {
    // eslint-disable-next-line
    sendMessage("Vote", { "room_name": roomName, size: size });
  },

  newVote(roomName: string) {
    // eslint-disable-next-line
    sendMessage("NewVote", { "room_name": roomName })
  },

  register() {
    sendMessage("Register", null);
  },

  setAvatar(email: string) {
    sendMessage("SetAvatar", { avatar: email });
  },

  setName(name: string) {
    sendMessage("SetName", { name: name });
  },

  on(event: string, callback: Function) {
    eventBus.$on(event, data => callback(data));
  },

  once(event: string, callback: Function) {
    eventBus.$once(event, data => callback(data));
  },

  rooms(): Array<RoomStatus> {
    return rooms;
  },

  room(roomName: string): RoomStatus {
    return getRoom(roomName);
  },

  users(): Map<string, UserData> {
    return users;
  },

  user(userId: string): UserData | undefined {
    return users.get(userId);
  },

  userVote(roomName: string): BoxedNumber {
    let vote = userVotes.get(roomName);
    if (vote === undefined) {
      vote = new BoxedNumber();
      userVotes.set(roomName, vote);
    }
    return vote;
  }
};
