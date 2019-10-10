import { GET_PROFILE, PROFILE_UPDATED } from "./types"
import { getCookie } from '../functions.js';

export const getUserDetailsAction = () => dispatch => {
const Cosmic = require('cosmicjs')({
  token: getCookie('val') // optional
})
let mail = getCookie('sId');
if (mail) {
  Cosmic.getBuckets()
  .then(data => {
    let bucket = Cosmic.bucket({
      slug: data.buckets[0].slug,
      read_key: data.buckets[0].api_access.read_key
    })
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
}

export const editUserDetailsAction = (userData, postId, storePostToAccount, storeType) => dispatch => {
  const { object } = userData;
  const { metafields: profileData } = object;
  const Cosmic = require('cosmicjs')({
    token: getCookie('val') // optional
  })
  Cosmic.getBuckets()
  .then(data => {
    let bucket = Cosmic.bucket({
      slug: data.buckets[0].slug,
      write_key: data.buckets[0].api_access.write_key
    })
    let mail = getCookie('sId');
    let adjustedEmail = mail.replace("@", "");
    let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");

    const userIdMetadield = profileData.filter(obj => obj.key === 'uid');
    const userNameMetadield = profileData.filter(obj => obj.key === 'uname');
    const userEmailMetadield = profileData.filter(obj => obj.key === 'email');
    const userSubmittedPostIds = profileData.filter(obj => obj.key === 'submittedPostIds');
    const userPostIds = profileData.filter(obj => obj.key === 'storedPostIds');

    const storeTypeAction = userPostIds.length && storeType === 'store';
    const submitTypeAction = userPostIds.length && storeType === 'submit';

    let newStoredPosts =  userPostIds.length ? `${userPostIds[0].value}` : ``;
    let newSubmittedPosts = userSubmittedPostIds.length ? `${userSubmittedPostIds[0].value}` : ``;

    let replaceableId = `${postId}`;
    let replaceableIdList = `, ${postId}`;
    newStoredPosts = storeTypeAction ? `${userPostIds[0].value}` : submitTypeAction ? `${userSubmittedPostIds[0].value}` : ``;

    if (newStoredPosts.indexOf(replaceableIdList) !== -1 && !storePostToAccount) {
      const replacedStoredPosts = newStoredPosts.replace(replaceableIdList, "");
      newStoredPosts = replacedStoredPosts;
    } else if (newStoredPosts.indexOf(replaceableId) !== -1 && !storePostToAccount) {
      const replacedStoredPosts = newStoredPosts.replace(replaceableId, "");
      newStoredPosts = replacedStoredPosts;
    } else if (storePostToAccount) {
      const replacedStoredPosts = newStoredPosts = newStoredPosts === '' ? `${postId}` : `${newStoredPosts}, ${postId}`;
      newStoredPosts = replacedStoredPosts;
    }

    if (storeTypeAction) {
      localStorage.setItem('storedPostIds', newStoredPosts);
    } else if (submitTypeAction) {
      localStorage.setItem('submittedPostIds', newStoredPosts);
      newSubmittedPosts = newStoredPosts;
      newStoredPosts = userPostIds.length ? `${userPostIds[0].value}` : ``;
    }

    bucket.editObject({
      slug: emailEncoded,
      metafields: [
        {
          value: newSubmittedPosts,
          key: 'submittedPostIds',
          title: 'submittedPostIds',
          type: 'text',
          children: null
        },
        {
          value: newStoredPosts,
          key: 'storedPostIds',
          title: 'storedPostIds',
          type: 'text',
          children: null
        },
        {
          value: userIdMetadield[0].value,
          key: 'uid',
          title: 'uid',
          type: 'text',
          children: null
        },
        {
          value: userNameMetadield[0].value,
          key: 'uname',
          title: 'userName',
          type: 'text',
          children: null
        },
        {
          value: userEmailMetadield[0].value,
          key: 'email',
          title: 'userMail',
          type: 'text',
          children: null
        }]
    }).then(data => {
      dispatch({
       type: PROFILE_UPDATED,
       payload: data
      })
    }).catch(err => {
      console.log(err)
    })
  })
}

const delete_cookie = (name) => {
    document.cookie = name + '=;expires=Thu, 01 Jan 1990 00:00:01 GMT;';
};

export const clearAllStorage = () => {
  const storedPostIds = localStorage.getItem('storedPostIds');
  const submittedPostIds = localStorage.getItem('submittedPostIds');
  !!storedPostIds && localStorage.removeItem('storedPostIds');
  !!submittedPostIds && localStorage.removeItem('submittedPostIds');

  const token = getCookie('val');
  const mail = getCookie('sId');
  !!token && delete_cookie('val');
  !!mail && delete_cookie('sId');

  window.location.reload(true);
}
