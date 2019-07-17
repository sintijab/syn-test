import { LOGGED_IN, LOGGED_OUT } from "./types"
import { setCookie, eraseCookie, getCookie } from '../functions.js';

export const signInAction = (data, uEmail) => dispatch => {
  setCookie('val', data.token, 1);
  setCookie('uId', uEmail, 1);
  const userData = {
    uEmail: uEmail,
  }
 dispatch({
  type: LOGGED_IN,
  payload: userData
 })
}

export const signOutAction = () => dispatch => {
  eraseCookie('val');
 dispatch({
  type: LOGGED_OUT,
 })
}

export const signStatusAction = () => dispatch => {
  const hasLoggedIn = !!(getCookie('val'));
  const userId = getCookie('uId');
  const userData = {
    uEmail: userId,
  }

  if (hasLoggedIn) {
    dispatch({
     type: LOGGED_IN,
     payload: userData
    })
  } else {
   dispatch({
    type: LOGGED_OUT,
   })
  }
}
