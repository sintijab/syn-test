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
    const { loggedIn, isMobile, fetchPosts } = this.state;
    if (loggedIn && isMobile && !fetchPosts) {
      this.props.getUserDetailsAction();
      this.props.fetchPostAction();
    }
  }

  componentDidUpdate() {
    const { posts, signType } = this.props;
    const { isMobile, fetchPosts, postsByLocation, location } = this.state;
    if (signType === 'LOGGED_IN' && isMobile && !fetchPosts) {
      this.props.getUserDetailsAction();
      this.props.fetchPostAction();
      this.setState({ fetchPosts: true });
    }
    if (posts && posts.postsData) {
      const filterPostsByLocation = posts.postsData.filter(post => post.metadata.location === location || post.metadata.location === 'Global');
      if (posts.type === 'POSTS_FETCHED' && !postsByLocation) {
        this.setState({
          postsByLocation: filterPostsByLocation,
          activePost: filterPostsByLocation[0] || {},
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
      if (isMobile && loggedIn) {
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
