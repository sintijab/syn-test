import React from 'react';
import { getCookie, validateImgSource} from '../functions.js';
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
      cosmic: null,
      imageIsValid: false,
    }

    const _this = this;

    if (_this.state.loggedIn && _this.state.isMobile) {
      axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/objects`, {
        params: {
          type: 'tests'
        } })
      .then(function (response) {
        if (!response.data.objects) {
          _this.setState({
            error: true,
            loading: false
          })
        } else {
          let postItems = response.data.objects || [];
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
                posts: postItems,              },
              loading: false
            });
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }

  render() {
    const { isMobile, loggedIn, cosmic, imageIsValid } = this.state;
    const { expandInfo } = this.props;
      if (isMobile && loggedIn) {
        return (
          <div className="post-feed">
          <Post isMobile={isMobile} loggedIn={loggedIn} cosmic={cosmic} imageIsValid={imageIsValid} />
         </div>
       );
      }
    return <div />;
   }
}

export default Posts;
