
function user(state = { room: '', name: '', socketId: null }, action) {
  switch(action.type) {
    case 'USER_UPDATE':
      return state;
    default:
      return state;
  }
}

export default user;
