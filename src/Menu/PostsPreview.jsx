import React from 'react';

class PostsPreview extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activePost: null,
    }
  }


  render() {
    const { posts } = this.props;
    const post = posts.map(post => {
      const postTitle = post.title;
      const postDate = post.metadata.date;
      const postImage = post.metadata.img;

      return (
        <div className="preview_post">
          <div className="preview_post-date">{postDate}</div>
          <div className="preview_post-title">{postTitle}</div>
          {postImage && <img src={postImage} alt="bkg" className="preview_post-img"/>}
        </div>
      );
    });
      return (
        <div className="preview">
        {post}
       </div>
     );
   }
}

export default PostsPreview;
