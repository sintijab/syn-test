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
    }
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  fetchPosts() {
    const { loggedIn, isMobile, fetchPosts } = this.state;
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
            postItems.forEach(post => {
              const isSourceValid = validateImgSource(post.metadata.img);
              if (!isSourceValid) {
                const defaultNumber = Math.floor((Math.random() * 3) + 1);
                post.metadata.img = defaultNumber === 1 ? defaultPostImg1 : defaultNumber === 2 ? defaultPostImg2 : defaultPostImg3;
              }
            })
            _this.setState({
              cosmic: {
                posts: postItems,
              },
              activePost: postItems[0],
              activeIndex: 0,
              loading: false,
              fetchPosts: true,
              loggedIn: true,
            });
            _this.props.fetchPostAction(postItems);
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    })
  }

  componentDidMount() {
    const { loggedIn, isMobile, fetchPosts } = this.state;
    if (loggedIn && isMobile && !fetchPosts) {
      this.fetchPosts();
    }
  }

  componentDidUpdate() {
    const { signType } = this.props;
    const { loggedIn, isMobile, fetchPosts } = this.state;
    if (signType === 'LOGGED_IN' && isMobile && !fetchPosts) {
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
  uData: state.signInStatus.uData
})


export default connect(mapStateToProps, { signInAction, fetchPostAction })(Posts);
