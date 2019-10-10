import { POSTS_FETCHED, POSTS_UPDATED } from "./types"
import { getCookie, validateImgSource } from '../functions.js';
import defaultPostImg1 from '../img/default01.png';
import defaultPostImg2 from '../img/default02.png';
import defaultPostImg3 from '../img/default02.png';

export const fetchPostAction = postsData => dispatch => {
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
      dispatch({
       type: POSTS_FETCHED,
       payload: null,
      })
    } else {
      let postItems = response.objects || [];
      if (postItems && postItems.length) {
        postItems.forEach(post => {
          const isSourceValid = validateImgSource(post.metadata.img);
          if (!isSourceValid) {
            const defaultNumber = Math.floor((Math.random() * 3) + 1);
            post.metadata.img = defaultNumber === 1 ? defaultPostImg1 : defaultNumber === 2 ? defaultPostImg2 : defaultPostImg3;
          }
        })
        dispatch({
         type: POSTS_FETCHED,
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
