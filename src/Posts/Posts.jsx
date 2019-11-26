import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../functions.js';
import { signInAction } from '../actions/signActions.js';
import { fetchPostAction } from '../actions/postActions.js';
import { getUserDetailsAction } from '../actions/profileActions.js';

import Post from './Post';

class Posts extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isMobile: !!(window.innerWidth < 479),
      loggedIn: !!(getCookie('val')),
      fetchPosts: null,
      postsByLocation: null,
      imageIsValid: false,
      activePost: null,
      activeIndex: null,
      location: getCookie('location'),
    }
  }


  componentDidMount() {
    const { loggedIn, isMobile, fetchPosts, postsByLocation } = this.state;
    if (loggedIn && isMobile && !fetchPosts) {
      this.props.getUserDetailsAction();
      this.props.fetchPostAction();
    }
    if (isMobile && !loggedIn && window.location.pathname !== "/" && window.location.pathname !== "") {
      let Cosmic = require('cosmicjs')();
      Cosmic.authenticate({
        email: 'info@syn4ny.com',
        password: 'ContributeAccessTest',
      }).then(data => {
        Cosmic = require('cosmicjs')({
          token: data.token,
        })
        Cosmic.getBuckets()
        .then(data => {
          const slugQuery = window.location.pathname.substr(1, window.location.pathname.length)
          let bucket = Cosmic.bucket({
            slug: data.buckets[0].slug,
            read_key: data.buckets[0].api_access.read_key
          })
          bucket.getObject({
            slug: slugQuery,
          }).then(response => {
            const allPosts = loggedIn ? postsByLocation : [response.object];
            this.setState({
              postsByLocation: allPosts,
              activePost: response.object,
            })
          }).catch(err => {
            console.log(err)
          });
        });
      })
      .catch(err => {
        console.error(err)
      })
    }
  }

  componentDidUpdate() {
    const { posts, signType } = this.props;
    const { isMobile, fetchPosts, postsByLocation, location, activePost } = this.state;
    if (signType === 'LOGGED_IN' && isMobile && !fetchPosts) {
      this.props.getUserDetailsAction();
      this.props.fetchPostAction();
      this.setState({ fetchPosts: true });
    }
    if (posts && posts.postsData) {
      const filterPostsByLocation = posts.postsData.filter(post => post.metadata.location === location || post.metadata.location === 'Global');
      if (posts.type === 'POSTS_FETCHED' && !postsByLocation) {
        let activeObj = filterPostsByLocation[0];

        if (window.location.pathname === "" || window.location.pathname === "/") {
          window.history.replaceState(window.location.href, '', `/${filterPostsByLocation[0].slug}`)
        }
        if (window.location.pathname !== "" && window.location.pathname !== "/") {
          const slugQuery = window.location.pathname.substr(1, window.location.pathname.length);
          activeObj = filterPostsByLocation.filter(obj => obj.slug === slugQuery);
        }
        activeObj = activeObj.length ? activeObj[0] : filterPostsByLocation[0];
        this.setState({
          postsByLocation: filterPostsByLocation,
          activePost: activeObj || {},
          activeIndex: 0,
          loading: false,
          fetchPosts: true,
          loggedIn: true,
        });
      }
    }
  }

  render() {
    const { isMobile, loggedIn, postsByLocation, imageIsValid, activePost, activeIndex } = this.state;
      if (isMobile && activePost) {
        return (
          <div className="post-feed">
          <Post isMobile={isMobile} loggedIn={loggedIn} postsByLocation={postsByLocation} imageIsValid={imageIsValid} firstPost={activePost} firstIndex={activeIndex} />
         </div>
       );
      }
    return <div />;
   }
}

const mapStateToProps = state => ({
  error: state.error,
  signType: state.signInStatus.type,
  uData: state.signInStatus.uData,
  posts: state.postsState,
})


export default connect(mapStateToProps, { signInAction, fetchPostAction, getUserDetailsAction })(Posts);
