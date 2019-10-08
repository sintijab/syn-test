
const initialState = {
	payload: {},
}

export default (state = initialState, action) => {
 switch (action.type) {
  case 'LOGGED_IN':
   return {
		 ...state,
		  type: action.type,
      uData: action.payload
   }
   case 'LOGGED_OUT':
    return {
			...state,
      type: action.type,
    }
  default:
   return state
 }
}
