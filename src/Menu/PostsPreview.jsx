import React from 'react';
import PostDetails from './PostDetails.jsx';

class PostsPreview extends React.Component {

  render() {
    const { posts } = this.props;
    const previewPosts = posts.map(post => {
      return (
        <PostDetails data={post} />
     );
    });
    return <div className="preview">{previewPosts}</div>
   }
}

export default PostsPreview;
