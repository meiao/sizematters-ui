import {
  Vote,
  VoteResults,
  RoomStatus,
  UserIdRoom,
  UserRoom,
  OwnVote
} from "./data";

import userStore from "./user.store";

const votes: Map<string, Map<string, Vote>> = new Map();

function roomVotes(roomName: string): Map<string, Vote> {
  let roomVotes = votes.get(roomName);
  if (roomVotes === undefined) {
    roomVotes = new Map();
    votes.set(roomName, roomVotes);
  }
  return roomVotes;
}

function userVote(roomName: string, userId: string): Vote {
  const roomVs = roomVotes(roomName);

  let vote = roomVs.get(userId);
  if (vote === undefined) {
    vote = new Vote();
    roomVs.set(userId, vote);
  }
  return vote;
}

function newVote(roomName: string) {
  const roomVs = roomVotes(roomName);
  roomVs.forEach(vote => {
    vote.value = undefined;
    vote.hasVoted = false;
  });
}

function voteStatus(roomName: string, votes: Map<string, boolean>) {
  Object.keys(votes).forEach(
    userId => (userVote(roomName, userId).hasVoted = votes[userId])
  );
}

function voteResults(voteResults: VoteResults) {
  const votesFromServer = voteResults.votes;
  Object.keys(votesFromServer).forEach(userId => {
    const vote = userVote(voteResults.room_name, userId);
    vote.value = votesFromServer[userId];
    vote.hasVoted = true;
  });
}

function roomJoined(roomStatus: RoomStatus) {
  roomStatus.users.forEach(user =>
    userVote(roomStatus.room_name, user.user_id)
  );
}

function ownVote(vote: OwnVote) {
  const myVote = userVote(vote.room_name, userStore.userId());
  myVote.value = vote.size;
  myVote.hasVoted = true;
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

  ownVote(vote: OwnVote) {
    return ownVote(vote);
  },

  getOwnVote(roomName: string) {
    return userVote(roomName, userStore.userId());
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

  voteStatus(roomName: string, votes: Map<string, boolean>) {
    voteStatus(roomName, votes);
  },

  voteResults(votes: VoteResults) {
    voteResults(votes);
  }
};
