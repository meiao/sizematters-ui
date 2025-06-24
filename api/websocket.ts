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
      userStore.roomJoined(data.data);
      voteStore.roomJoined(data.data);
      roomStore.roomJoined(data.data);
      break;
    case "UserLeft":
      voteStore.userLeft(data.data);
      roomStore.userLeft(data.data);
      break;
    case "UserJoined":
      userStore.userUpdated(data.data.user);
      voteStore.userJoined(data.data);
      roomStore.userJoined(data.data);
      break;
    case "UserUpdated":
      userStore.userUpdated(data.data.user);
      break;
    case "OwnVote":
      voteStore.ownVote(data.data);
      break;
    case "VoteStatus":
      roomStore.voteStatus(data.data.room_name, data.data.votes);
      voteStore.voteStatus(data.data.room_name, data.data.votes);
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
    case "Randomized":
      roomStore.randomized(data.data.room_name, data.data.selected_user_id);
      break;
    case "ScaleChanged":
      roomStore.scaleChanged(data.data.room_name, data.data.selected_scale);
      break;
    case "ActiveUpdated":
      userStore.activeUpdated(data.data);
      break;
    default:
      console.log("websocket.processMessage: message not handled:" + data.type);
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
  userStore.setNameSet();
}

function updateActive(roomName: string, userId: string, active: boolean) {
  sendMessage("UpdateActive", {
    room_name: roomName,
    user_id: userId,
    active: active,
  });
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
    socket = new WebSocket(process.env.VUE_APP_BACKEND);
    socket.onmessage = (msg) => processMessage(msg);
    checkConnection(successCallback, failureCallback);
  },

  joinRoom(roomName: string, password: string, passwordIsHash: boolean) {
    // eslint-disable-next-line
    sendMessage("JoinRoom", {
      room_name: roomName,
      password: password,
      password_is_hash: passwordIsHash,
    });
  },

  leaveRoom(roomName: string) {
    // eslint-disable-next-line
    sendMessage("LeaveRoom", { room_name: roomName });
  },

  vote(roomName: string, size: number) {
    // eslint-disable-next-line
    sendMessage("Vote", { room_name: roomName, size: size });
  },

  newVote(roomName: string) {
    // eslint-disable-next-line
    sendMessage("NewVote", { room_name: roomName });
  },

  randomize(roomName: string) {
    sendMessage("Randomize", { room_name: roomName });
  },

  register() {
    sendMessage("Register", null);
  },

  changeScale(roomName: string, selectedScaleName: string) {
    sendMessage("ChangeScale", {
      room_name: roomName,
      selected_scale_name: selectedScaleName,
    });
  },

  setAvatar(email: string) {
    setAvatar(email);
  },

  setName(name: string) {
    setName(name);
  },

  updateActive(roomName: string, userId: string, active: boolean) {
    updateActive(roomName, userId, active);
  },

  on(event: string, callback: Function) {
    eventBus.$on(event, (data) => callback(data));
  },

  once(event: string, callback: Function) {
    eventBus.$once(event, (data) => callback(data));
  },
};
