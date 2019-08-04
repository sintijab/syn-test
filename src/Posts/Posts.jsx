import React from 'react';
import { getCookie } from '../functions.js';
import axios from 'axios';
import Post from './Post';

class Posts extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isMobile: !!(window.innerWidth < 479),
      loggedIn: !!(getCookie('val')),
      cosmic: null,
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
          _this.setState({
            cosmic: {
              posts: response.data.objects,
            },
            loading: false
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }


  render() {
    const { isMobile, loggedIn, cosmic } = this.state;
      if (isMobile && loggedIn) {
        return (
          <div className="post-feed">
          <Post isMobile={isMobile} loggedIn={loggedIn} cosmic={cosmic}/>
         </div>
       );
      }
    return <div />;
   }
}

export default Posts;
