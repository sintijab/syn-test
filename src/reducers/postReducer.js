
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
		case 'POST_ADDED':
     return {
 			...state,
       type: action.type,
       postData: action.payload
     }
		 case 'NEXT_POST':
      return {
  			...state,
        type: action.type,
      }
		case 'STORED_POSTS_UPDATED':
     return {
  		 ...state,
  		  type: action.type,
     }
  default:
   return state
 }
}
