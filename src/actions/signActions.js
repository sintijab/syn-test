import { LOGGED_IN, LOGGED_OUT } from "./types"
import { setCookie, eraseCookie, getCookie } from '../functions.js';
import axios from 'axios';

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

export const getCurrentLocation = () => {
  axios.get(`http://api.ipstack.com/79.224.135.162?access_key=5e516d5bae0bfa0abd9896479873ad01`)
  .then(function (response) {
    if (response && response.data && response.data.city) {
      setCookie('city', response.data.city, 1);
      return response.data.city;
    }
  })
  .catch(function (error) {
    console.log(error)
  })
}
