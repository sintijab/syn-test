
const initialState = {
	payload: {},
}

export default (state = initialState, action) => {
 switch (action.type) {
  case 'LOGGED_IN':
   return {
		  type: action.type,
      uData: action.payload
   }
   case 'LOGGED_OUT':
    return {
      type: action.type,
    }
  default:
   return state
 }
}
