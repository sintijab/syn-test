import React from 'react';


class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activePost: null,
    }
  }

  componentDidUpdate() {
    const { cosmic } = this.props;
    const { activePost } = this.state;
    if (cosmic && cosmic.posts && cosmic.posts.length && !activePost) {
      this.setState({ activePost: cosmic.posts[0] });
    }
  }


  render() {
    const { isMobile, loggedIn } = this.props;
    const { activePost } = this.state;
      if (isMobile && loggedIn && activePost) {
        return (
          <div className="active-post">
            <div className="active-post-header">
              <span>{activePost.title}</span>
            </div>
         </div>
       );
      }
    return <div />;
   }
}

export default Post;
