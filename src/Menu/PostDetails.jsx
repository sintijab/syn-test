import React from 'react';

class PostDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showDetails: null,
    }

    this.displayDetails = this.displayDetails.bind(this);
  }

  displayDetails(post) {
    const { showDetails } = this.state;
    this.setState({ showDetails: !showDetails })
  }


  render() {
    const { data } = this.props;
    const { showDetails } = this.state;

    const postTitle = data.title || '';
    const postDate = data.metadata.date || '';
    const postImage = data.metadata.img || '';
    const postDescription = data.metadata.about || '';

    return (
      <div className={`${showDetails ? 'preview_post detailed_post' : 'preview_post'}`} key={data._id} onClick={this.displayDetails}>
        <div className="preview_post-date">{postDate}</div>
        <div className="preview_post-title">{postTitle}</div>
        {postImage && <img src={postImage} alt="bkg" className="preview_post-img"/>}
        {showDetails && <div>{postDescription}</div>}
      </div>
     );
   }
}

export default PostDetails;
