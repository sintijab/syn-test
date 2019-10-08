
const initialState = {
	payload: {},
}

export default (state = initialState, action) => {
 switch (action.type) {
  case 'POSTS_FETCHED':
   return {
		 ...state,
		  type: action.type,
      postsData: action.payload
   }
   case 'POSTS_UPDATED':
    return {
			...state,
      type: action.type,
      postsData: action.payload
    }
  default:
   return state
 }
}
