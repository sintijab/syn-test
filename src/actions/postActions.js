import { POSTS_FETCHED, POSTS_UPDATED, POST_ADDED, NEXT_POST, STORED_POSTS_UPDATED } from "./types"
import { getCookie, validateImgSource } from '../functions.js';
import defaultPostImg1 from '../img/default001.png';
import defaultPostImg2 from '../img/default002.png';
import defaultPostImg3 from '../img/default003.png';

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

export const addPostAction = formData => dispatch => {
  const { title, about, imgurl, period, plan, info, city, author, userData } = formData;

  let date = new Date();
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();

  date = mm + '/' + dd + '/' + yyyy;
  const postId = `${title}${author}${date}`;

  const params = {
    title: title,
    type_slug: 'tests',
    content: '',
    status: 'published',
    metafields: [
      {
        value: about,
        key: 'about',
        title: 'About',
        type: 'textarea',
        children: null
      },
      {
        value: imgurl,
        key: 'img',
        title: 'Image link',
        type: 'text',
        children: null
      },
      {
        value: period,
        key: 'period',
        title: 'Display period',
        type: 'text',
        children: null
      },
      {
        value: plan,
        key: 'actions',
        title: 'Actions',
        type: 'textarea',
        children: null
      },
      {
        value: info,
        key: 'info',
        title: 'Additional info',
        type: 'textarea',
        children: null
      },
      {
        value: city,
        key: 'city',
        title: 'City (range)',
        type: 'text',
        children: null
      },
      {
        value: author,
        key: 'author',
        title: 'Author',
        type: 'text',
        children: null
      },
      {
        value: date,
        key: 'date',
        title: 'Added',
        type: 'text',
        children: null
      },
      {
        value: postId,
        key: 'postId',
        title: 'postId',
        type: 'text',
        children: null
      },
    ],
    options: {
      slug_field: false
    }
  }
  if(!!getCookie('val')) {
  const Cosmic = require('cosmicjs')({
    token: getCookie('val') // optional
  })
  Cosmic.getBuckets()
  .then(data => {
    const bucket = Cosmic.bucket({
      slug: data.buckets[0].slug,
      write_key: data.buckets[0].api_access.write_key,
    })

  bucket.addObject(params)
  .then(data => {
    dispatch({
     type: POST_ADDED,
     payload: data
    })
  })
  .catch(err => {
    console.log(err)
  })
  })
  .catch(err => {
    console.log(err)
  })
  }
}

export const nextPostAction = () => dispatch => {
  dispatch({
   type: NEXT_POST,
  })
}

export const updateUserStoredPostsAction = () => dispatch => {
  dispatch({
   type: STORED_POSTS_UPDATED
  })
}
