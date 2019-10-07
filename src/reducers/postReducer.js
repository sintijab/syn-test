
const initialState = {
	payload: {},
}

export default (state = initialState, action) => {
 switch (action.type) {
  case 'POSTS_FETCHED':
   return {
		  type: action.type,
      postsData: action.payload
   }
   case 'POSTS_UPDATED':
    return {
      type: action.type,
      postsData: action.payload
    }
  default:
   return state
 }
}
