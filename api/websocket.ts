import Vue from "vue";
import { RoomStatus, UserData, UserLeft } from "api/data";

const eventBus = new Vue();

let socket: WebSocket;

let userId: string;
const rooms: RoomStatus[] = [];
const roomMap: Map<string, RoomStatus> = new Map();
const users: Map<string, UserData> = new Map();

function yourData(userData: UserData) {
  userId = userData.user_id;
}

function roomJoined(roomStatus: RoomStatus) {
  rooms.push(roomStatus);
  roomMap.set(roomStatus.room_name, roomStatus);
  roomStatus.users.forEach(user => {
    if (!users.has(user.user_id)) {
      users.set(user.user_id, user);
    }
  });
}

function userLeft(userLeft: UserLeft) {
  const roomName = userLeft.room_name;
  if (userLeft.user_id == userId) {
    const room = roomMap.get(roomName);
    roomMap.delete(roomName);
    if (room !== undefined) {
      const index = rooms.indexOf(room);
      if (index > -1) {
        rooms.splice(index, 1);
      }
    }
  } else {
    const room = roomMap.get(roomName);
    if (room !== undefined){
      const usersInRoom = room.users;
      const index = usersInRoom.findIndex( x => x.user_id == userLeft.user_id);
      if (index !== undefined && index > -1) {
        usersInRoom.splice(index, 1);
      }
    }
  }
}

function processMessage(msg: MessageEvent) {
  const data = JSON.parse(msg.data);
  eventBus.$emit(data.type, data.data);
console.log(data.type);
  if (data.type == "RoomJoined") {
    roomJoined(data.data);
  } else if (data.type == "UserLeft") {
    userLeft(data.data);
  } else if (data.type == "YourData") {
    yourData(data.data.user);
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

  users(): Map<string, UserData> {
    return users;
  }
};
