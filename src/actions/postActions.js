import { POSTS_FETCHED, POSTS_UPDATED } from "./types"
import { getCookie } from '../functions.js';

export const fetchPostAction = postsData => dispatch => {
 dispatch({
  type: POSTS_FETCHED,
  payload: postsData
 })
}

export const getPostsAction = () => dispatch => {
  const _this = this;
  const Cosmic = require('cosmicjs')({
    token: getCookie('val') // optional
  })
  Cosmic.getBuckets()
  .then(data => {
    const bucket = Cosmic.bucket({
      slug: data.buckets[0].slug,
      read_key: data.buckets[0].api_access.read_key,
    });
  bucket.getObjects({
    type: 'tests',
}).then(function (response) {
    if (!response.objects) {
      _this.setState({
        error: true,
        loading: false
      })
    } else {
      let postItems = response.objects || [];
      if (postItems && postItems.length) {
        dispatch({
         type: POSTS_UPDATED,
         payload: postItems
        })
      }
    }
  })
  .catch(function (error) {
    console.log(error)
  })
})
}
