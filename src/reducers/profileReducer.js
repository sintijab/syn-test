
const initialState = {
	payload: {},
}

export default (state = initialState, action) => {
 switch (action.type) {
  case 'GET_PROFILE':
   return {
		 ...state,
		  type: action.type,
      profileDetails: action.payload
   }
   case 'PROFILE_UPDATED':
    return {
 		 ...state,
 		  type: action.type,
      profileUpdateDetails: action.payload
    }
  default:
   return state
 }
}
