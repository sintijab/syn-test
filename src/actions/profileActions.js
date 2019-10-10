import { GET_PROFILE } from "./types"
import { getCookie } from '../functions.js';

export const getUserDetailsAction = () => dispatch => {
const Cosmic = require('cosmicjs')({
  token: getCookie('val') // optional
})
Cosmic.getBuckets()
.then(data => {
  let bucket = Cosmic.bucket({
    slug: data.buckets[0].slug,
    read_key: data.buckets[0].api_access.read_key
  })
  let mail = getCookie('sId');
  let adjustedEmail = mail.replace("@", "");
  let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");
  bucket.getObject({
    slug: emailEncoded
  }).then(userData => {
    dispatch({
     type: GET_PROFILE,
     payload: userData
    })
  }).catch(err => {
    console.log(err)
  })
})
}
