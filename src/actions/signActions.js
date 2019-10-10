import { LOGGED_IN, LOGGED_OUT } from "./types"
import { setCookie, eraseCookie, getCookie } from '../functions.js';
import axios from 'axios';
const hashed = require('password-hash');

export const signInAction = (email, password) => dispatch => {
  const uEmail = 'sintija649@gmail.com';
  const contributorId = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac3luNG55LmNvbSIsInBhc3N3b3JkIjoiMmU5YmE4MmQ5YTMwYjZkMzkxNDNhNDRiZDJiZmYyMTQiLCJpYXQiOjE1NzAzOTI4MTN9.z-X-dCaFXxMKxjXBy46d9y62H3OMZKXM6qlcU1Q_Sf0';
  setCookie('val', contributorId, 1);
  setCookie('sId', email, 1);

  let adjustedEmail = email.replace("@", "");
  let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");
  const _this = this;
  const Cosmic = require('cosmicjs')({
    token: getCookie('val') // optional
  })
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
      this.setState({
        error: true,
        loading: false
      })
    } else {
      let responseData = response.object.metadata.uid;
      const logInSuccess = hashed.verify(JSON.stringify(password), responseData);
      dispatch({
       type: LOGGED_IN,
       payload: logInSuccess
      })
      if (logInSuccess) {
        getCurrentLocation();
        if(response.object.metadata.storedPostIds) {
          localStorage.setItem('storedPostIds', response.object.metadata.storedPostIds);
        } else if (response.object.metadata.submittedPostIds) {
          localStorage.setItem('submittedPostIds', response.object.metadata.submittedPostIds);
        }
      }
    }
  })
  .catch(function (error) {
    console.log(error)
    _this.setState({
      signInSuccess: false,
      email: '',
      password: '',
    })
  })
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
