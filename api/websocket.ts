import Vue from "vue";
import roomStore from "./room.store";
import userStore from "./user.store";
import voteStore from "./vote.store";

let socket: WebSocket;
const eventBus = new Vue();

function processMessage(msg: MessageEvent) {
  const data = JSON.parse(msg.data);
  eventBus.$emit(data.type, data.data);
  switch (data.type) {
    case "RoomJoined":
      roomStore.roomJoined(data.data);
      userStore.roomJoined(data.data);
      voteStore.roomJoined(data.data);
      break;
    case "UserLeft":
      roomStore.userLeft(data.data);
      voteStore.userLeft(data.data);
      break;
    case "UserJoined":
      roomStore.userJoined(data.data);
      userStore.userUpdated(data.data);
      voteStore.userJoined(data.data);
      break;
    case "UserUpdated":
      userStore.userUpdated(data.data.user);
      break;
    case "OwnVote":
      voteStore.ownVote(data.data);
      break;
    case "VotesCast":
      roomStore.votesCast(data.data.room_name, data.data.votes_cast);
      break;
    case "NewVote":
      roomStore.newVote(data.data.room_name);
      voteStore.newVote(data.data.room_name);
      break;
    case "VoteResults":
      voteStore.voteResults(data.data);
      break;
    case "OwnData":
      userStore.ownData(data.data.user);
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

function setName(name: string) {
  sendMessage("SetName", { name: name });
  localStorage.setItem("name", name);
}

function setAvatar(email: string) {
  sendMessage("SetAvatar", { avatar: email });
  localStorage.setItem("avatar", email);
}

function restoreData() {
  const name = localStorage.getItem("name");
  if (name !== null) {
    setName(name);
  }
  const avatar = localStorage.getItem("avatar");
  if (avatar !== null) {
    setAvatar(avatar);
  }
}

function checkConnection(successCallback: Function, failureCallback: Function) {
  if (socket.readyState == WebSocket.OPEN) {
    restoreData();
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
    socket = new WebSocket("wss://ws.sizematters.dev");
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
    setAvatar(email);
  },

  setName(name: string) {
    setName(name);
  },

  on(event: string, callback: Function) {
    eventBus.$on(event, data => callback(data));
  },

  once(event: string, callback: Function) {
    eventBus.$once(event, data => callback(data));
  }
};
