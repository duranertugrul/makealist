import { SET_FRIEND_LIST } from '../constants';



export default (state = [], action) => {
  switch(action.type) {
    case SET_FRIEND_LIST:
      const { friendList } = action;
      
      return friendList;
    default:
      return state;
  }
}
