import React from 'react';
import { connect } from 'react-redux';
import { getCookie, validateImgSource} from '../functions.js';
import { signInAction } from '../actions/signActions.js';
import { fetchPostAction } from '../actions/postActions.js';
import defaultPostImg1 from '../img/default01.png';
import defaultPostImg2 from '../img/default02.png';
import defaultPostImg3 from '../img/default02.png';
import axios from 'axios';
import Post from './Post';

class Posts extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isMobile: !!(window.innerWidth < 479),
      loggedIn: !!(getCookie('val')),
      fetchPosts: null,
      cosmic: null,
      imageIsValid: false,
      activePost: null,
      activeIndex: null,
      cosmic: {
        posts: null,
      }
    }
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  fetchPosts() {
    const { loggedIn, isMobile, fetchPosts } = this.state;
    const { posts } = this.props;
    const { postsData = [] } = posts;
    this.setState({
      cosmic: {
        posts: posts,
      },
      activePost: postsData[0],
      activeIndex: 0,
      loading: false,
      fetchPosts: true,
      loggedIn: true,
    });
  }

  componentDidMount() {
    const { loggedIn, isMobile, fetchPosts } = this.state;
    if (loggedIn && isMobile && !fetchPosts) {
      this.props.fetchPostAction();
    }
  }

  componentDidUpdate() {
    const { signType, posts } = this.props;
    const { loggedIn, isMobile, fetchPosts } = this.state;
    if (posts.type === 'POSTS_FETCHED' && isMobile && !fetchPosts) {
      this.fetchPosts();
    }
  }

  render() {
    const { isMobile, loggedIn, cosmic, imageIsValid, activePost, activeIndex } = this.state;
      if (isMobile && loggedIn) {
        return (
          <div className="post-feed">
          <Post isMobile={isMobile} loggedIn={loggedIn} cosmic={cosmic} imageIsValid={imageIsValid} firstPost={activePost} firstIndex={activeIndex} />
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


export default connect(mapStateToProps, { signInAction, fetchPostAction })(Posts);
