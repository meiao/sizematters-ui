import { RoomStatus, UserRoom, UserIdRoom, Scale } from "./data";

import userStore from "./user.store";

const rooms: RoomStatus[] = [];
const roomMap: Map<string, RoomStatus> = new Map();

function getRoom(roomName: string): RoomStatus {
  let room = roomMap.get(roomName);
  if (room === undefined) {
    room = new RoomStatus();
    roomMap.set(roomName, room);
  }
  return room;
}

function getNumbers(roomName: string): string[] {
  const room = getRoom(roomName);
  const numbers = room.scale_values[room.selected_scale_name].values;
  return numbers;
}

function roomJoined(roomStatus: RoomStatus) {
  roomMap.set(roomStatus.room_name, roomStatus);
  rooms.push(roomStatus);
}

function userJoined(userData: UserRoom) {
  const room = roomMap.get(userData.room_name);
  if (room !== undefined) {
    const usersInRoom = room.users;
    usersInRoom.push(userData.user);
  }
}

function userLeft(userLeft: UserIdRoom) {
  const roomName = userLeft.room_name;
  if (userLeft.user_id == userStore.userId()) {
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
    if (room !== undefined) {
      const usersInRoom = room.users;
      const index = usersInRoom.findIndex((x) => x.user_id == userLeft.user_id);
      if (index !== undefined && index > -1) {
        usersInRoom.splice(index, 1);
      }
    }
  }
}

function voteStatus(roomName: string, votes: Record<string, boolean>) {
  const room = getRoom(roomName);
  let voteCount = 0;
  Object.keys(votes).forEach((userId) => {
    if (votes[userId]) {
      voteCount++;
    }
  });

  // eslint-disable-next-line
  room.votes_cast = voteCount;
}

function newVote(roomName: string) {
  const room = getRoom(roomName);
  // eslint-disable-next-line
  room.votes_cast = 0;
}

function randomized(roomName: string, selectedUser: string) {
  const room = getRoom(roomName);
  // eslint-disable-next-line
  room.selected_user = selectedUser;
}

function scaleChanged(roomName: string, selectedScaleName: string) {
  const room = getRoom(roomName);
  // eslint-disable-next-line
  room.selected_scale_name = selectedScaleName;
}
function roomUrl(roomStatus: RoomStatus): string {
  return (
    window.location.protocol +
    "//" +
    window.location.host +
    "/room/" +
    roomStatus.room_name +
    "/" +
    roomStatus.hashed_password
  );
}

function textToClipboard(text) {
  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

function copyRoomUrl(roomStatus: RoomStatus) {
  textToClipboard(roomUrl(roomStatus));
}

export default {
  rooms(): Array<RoomStatus> {
    return rooms;
  },

  room(roomName: string): RoomStatus {
    return getRoom(roomName);
  },

  numbers(roomName: string): string[] {
    return getNumbers(roomName);
  },

  roomJoined(roomStatus: RoomStatus) {
    roomJoined(roomStatus);
  },

  userJoined(userData: UserRoom) {
    userJoined(userData);
  },

  userLeft(userData: UserIdRoom) {
    userLeft(userData);
  },

  voteStatus(roomName: string, voteCount: Record<string, boolean>) {
    voteStatus(roomName, voteCount);
  },

  newVote(roomName: string) {
    newVote(roomName);
  },

  randomized(roomName: string, selectedUser: string) {
    randomized(roomName, selectedUser);
  },

  scaleChanged(roomName: string, selectedScale: Scale) {
    scaleChanged(roomName, selectedScale.name);
  },
  roomUrl(roomStatus: RoomStatus): string {
    return roomUrl(roomStatus);
  },
  copyRoomUrl(roomStatus: RoomStatus) {
    copyRoomUrl(roomStatus);
  },
};
