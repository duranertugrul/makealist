import { SET_LIST_HEADERS } from '../constants';



export default (state = [], action) => {
  switch(action.type) {
    case SET_LIST_HEADERS:
      const { listHeaders } = action;
      
      return listHeaders;
    default:
      return state;
  }
}
