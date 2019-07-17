import { combineReducers } from 'redux';
import signReducer from './signReducer';

const appReducer = combineReducers({
  signInStatus: signReducer
});

export default (state, action) => {
	const initialState = appReducer({}, {})
	switch (action.type) {
		default:
			state = initialState
	}
	return appReducer(state, action)
}
