import { UserData, RoomStatus, BoxedValue } from "./data";

const users: Map<string, UserData> = new Map();
let ownUserId = "Not set";
const nameSet = new BoxedValue(false);

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

function roomJoined(roomStatus: RoomStatus) {
  roomStatus.users.forEach((user) => userUpdated(user));
}

function ownData(userData: UserData) {
  ownUserId = userData.user_id;
  userUpdated(userData);
}

function isNameSet(): BoxedValue<boolean> {
  return nameSet;
}

function setNameSet() {
  nameSet.value = true;
}

function activeUpdated(userData: UserData) {
  const user = users.get(userData.user_id);
  if (user !== undefined) {
    // eslint-disable-next-line
    user.active = userData.active;
  }
}

export default {
  users(): Map<string, UserData> {
    return users;
  },

  user(userId: string): UserData | undefined {
    return users.get(userId);
  },

  userId(): string {
    return ownUserId;
  },

  roomJoined(roomStatus: RoomStatus) {
    roomJoined(roomStatus);
  },

  userUpdated(userData: UserData) {
    userUpdated(userData);
  },

  ownData(userData: UserData) {
    ownData(userData);
  },

  isNameSet(): BoxedValue<boolean> {
    return isNameSet();
  },

  setNameSet() {
    setNameSet();
  },
  activeUpdated(userData: UserData) {
    activeUpdated(userData);
  },
};
