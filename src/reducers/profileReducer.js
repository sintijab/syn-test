
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
  default:
   return state
 }
}
