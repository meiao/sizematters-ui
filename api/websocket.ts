import Vue from "vue";

const eventBus = new Vue();

function processMessage(msg: MessageEvent) {
  const data = JSON.parse(msg.data);
  console.log("received msg");
  eventBus.$emit(data.type, data.data);
}

const socket = new WebSocket("ws://localhost:9001");
socket.onmessage = msg => processMessage(msg);

function sendMessage(type: string, content) {
  const message = {};
  message["type"] = type;
  message["data"] = content;
  const msg = JSON.stringify(message);
  socket.send(msg);
}

export default {
  joinRoom() {
    socket.send("joinRoom");
  },

  setAvatar(email: string) {
    sendMessage("SetAvatar", {"avatar": email});
  },

  setName(name: string) {
    sendMessage("SetName", {"name": name});
  },

  on(event: string, callback: Function) {
    eventBus.$on(event, data => callback(data));
  },

  once(event: string, callback: Function) {
    console.log("registered callback");
    eventBus.$once(event, data => callback(data));
  }
};
