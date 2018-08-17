import {SIGNED_IN, SET_LIST_HEADERS, SET_FRIEND_LIST} from '../constants';

export function logUser(email,userId){
  const action = {
    type: SIGNED_IN,
    email,
    userId
  }
  return action;
}

export function setListHeaders(listHeaders) {
  const action = {
    type: SET_LIST_HEADERS,
    listHeaders
  }
  return action;
}

export function setFriendList(friendList) {
  const action = {
    type: SET_FRIEND_LIST,
    friendList
  }
  return action;
}