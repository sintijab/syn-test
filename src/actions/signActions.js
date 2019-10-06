import { LOGGED_IN, LOGGED_OUT } from "./types"
import { setCookie, eraseCookie, getCookie } from '../functions.js';
import axios from 'axios';

export const signInAction = () => dispatch => {
  const uEmail = 'sintija649@gmail.com';
  const contributorId = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac3luNG55LmNvbSIsInBhc3N3b3JkIjoiMmU5YmE4MmQ5YTMwYjZkMzkxNDNhNDRiZDJiZmYyMTQiLCJpYXQiOjE1NzAzOTI4MTN9.z-X-dCaFXxMKxjXBy46d9y62H3OMZKXM6qlcU1Q_Sf0';
  setCookie('val', contributorId, 1);
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
  const userId = getCookie('sId');
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
