import {
  BoxedNumber,
  VoteResults,
  RoomStatus,
  UserIdRoom,
  UserRoom
} from "./data";

import userStore from "./user.store";

const votes: Map<string, Map<string, BoxedNumber>> = new Map();

function roomVotes(roomName: string): Map<string, BoxedNumber> {
  let roomVotes = votes.get(roomName);
  if (roomVotes === undefined) {
    roomVotes = new Map();
    votes.set(roomName, roomVotes);
  }
  return roomVotes;
}

function userVote(roomName: string, userId: string): BoxedNumber {
  const roomVs = roomVotes(roomName);

  let vote = roomVs.get(userId);
  if (vote === undefined) {
    vote = new BoxedNumber();
    roomVs.set(userId, vote);
  }
  return vote;
}

function newVote(roomName: string) {
  const roomVs = roomVotes(roomName);
  roomVs.forEach(vote => (vote.num = -1));
}

function voteResults(voteResults: VoteResults) {
  const votesFromServer = voteResults.votes;
  Object.keys(votesFromServer).forEach(userId => {
    userVote(voteResults.room_name, userId).num = votesFromServer[userId];
  });
}

function roomJoined(roomStatus: RoomStatus) {
  roomStatus.users.forEach(user =>
    userVote(roomStatus.room_name, user.user_id)
  );
}

function ownVote(roomName: string): BoxedNumber {
  return userVote(roomName, userStore.userId());
}

function userLeft(data: UserIdRoom) {
  const roomVs = roomVotes(data.room_name);
  roomVs.delete(data.user_id);
}

function userJoined(data: UserRoom) {
  userVote(data.room_name, data.user.user_id);
}

export default {
  userVote(roomName: string, userId: string) {
    return userVote(roomName, userId);
  },

  ownVote(roomName: string) {
    return ownVote(roomName);
  },

  roomJoined(roomStatus: RoomStatus) {
    roomJoined(roomStatus);
  },

  userLeft(data: UserIdRoom) {
    userLeft(data);
  },

  userJoined(data: UserRoom) {
    userJoined(data);
  },

  newVote(roomName: string) {
    newVote(roomName);
  },

  voteResults(votes: VoteResults) {
    voteResults(votes);
  }
};
