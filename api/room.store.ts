import { RoomStatus, UserRoom, UserIdRoom } from "./data";

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
      const index = usersInRoom.findIndex(x => x.user_id == userLeft.user_id);
      if (index !== undefined && index > -1) {
        usersInRoom.splice(index, 1);
      }
    }
  }
}

function votesCast(roomName: string, voteCount: number) {
  const room = getRoom(roomName);
  // eslint-disable-next-line
  room.votes_cast = voteCount;
}

function newVote(roomName: string) {
  const room = getRoom(roomName);
  // eslint-disable-next-line
  room.votes_cast = 0;
}

export default {
  rooms(): Array<RoomStatus> {
    return rooms;
  },

  room(roomName: string): RoomStatus {
    return getRoom(roomName);
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

  votesCast(roomName: string, voteCount: number) {
    votesCast(roomName, voteCount);
  },

  newVote(roomName: string) {
    newVote(roomName);
  }
};
