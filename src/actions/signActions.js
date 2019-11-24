import { LOGGED_IN, LOGGED_OUT } from "./types"
import { setCookie, getCookie } from '../functions.js';
import axios from 'axios';
const hashed = require('password-hash');
let Cosmic = require('cosmicjs')()
let contributorId = null

Cosmic.authenticate({
  email: 'info@syn4ny.com',
  password: 'Memorable123321.',
}).then(data => {
  Cosmic = require('cosmicjs')({
    token: data.token
  })
  contributorId = data.token
})
.catch(err => {
  console.error(err)
})

export const signInAction = (email, password) => dispatch => {
  let adjustedEmail = email.replace(/@/g, "").replace(/_/g, '-');
  let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "").toLowerCase();
  Cosmic.getBuckets()
  .then(data => {
    const bucket = Cosmic.bucket({
      slug: data.buckets[0].slug,
      read_key: data.buckets[0].api_access.read_key,
    })

  bucket.getObject({
    slug: emailEncoded,
}).then(function (response) {
    if (!response.object) {
      dispatch({
       type: LOGGED_OUT,
       payload: null
      })
    } else {
      let responseData = response.object.metadata.uid;
      const logInSuccess = hashed.verify(JSON.stringify(password), responseData);
      if (logInSuccess) {
        setCookie('sId', email, 1);
        setCookie('val', contributorId, 1);
        getCurrentLocation();
        dispatch({
         type: LOGGED_IN,
         payload: email
        })
        if(response.object.metadata.storedPostIds) {
          localStorage.setItem('storedPostIds', response.object.metadata.storedPostIds);
        }
      }
    }
  })
  .catch(function (error) {
    console.log(error)
    dispatch({
     type: LOGGED_OUT,
     payload: null
    })
  })
})
}

const delete_cookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1990 00:00:01 GMT;';
};

export const logOutAction = () => dispatch => {
  const storedPostIds = localStorage.getItem('storedPostIds');
  const storedNr = sessionStorage.getItem('authNr');
  !!storedPostIds && localStorage.removeItem('storedPostIds');
  !!storedNr && sessionStorage.removeItem('authNr');

  const token = getCookie('val');
  const mail = getCookie('sId');

  !!token && delete_cookie('val');
  !!mail && delete_cookie('sId');

  dispatch({
   type: LOGGED_OUT,
  })
  window.location.reload(true);
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
    if (response && response.data && response.data.country_name) {
      setCookie('location', response.data.country_name, 1);
      return response.data.country_name;
    }
  })
  .catch(function (error) {
    console.log(error)
  })
}
