import { SIGNED_IN } from '../constants';

let user = {
  email: null,
  userId: null
}

export default (state = user, action) => {
  switch (action.type) {
    case SIGNED_IN:
      const { email, userId } = action;
      user = {
        email,
        userId
      }
      return user;
    default:
      return state;
  }
}
