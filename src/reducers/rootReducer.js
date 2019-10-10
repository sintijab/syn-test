import { combineReducers } from 'redux';
import signReducer from './signReducer';
import postReducer from './postReducer';
import profileReducer from './profileReducer';

const appReducer = combineReducers({
  signInStatus: signReducer,
  postsState: postReducer,
  profileData: profileReducer,
});

export default (state, action) => {
	const initialState = appReducer({}, {})
	switch (action.type) {
		default:
			state = initialState
	}
	return appReducer(state, action)
}
