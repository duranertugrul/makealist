import { combineReducers } from 'redux';
import user from './reducer_user';
import listheaders from './reducer_listheader';
import friendlist from './reducer_friendlist';

export default combineReducers({
  user,
  listheaders,
  friendlist
})
