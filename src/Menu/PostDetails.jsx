import React from 'react';
import { validateImgSource } from '../functions.js';
import defaultPostImg1 from '../img/default01.png';
import defaultPostImg2 from '../img/default02.png';
import defaultPostImg3 from '../img/default02.png';

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

    const { metadata } = data;

    const {
      about: aboutText,
      actions: actionsText,
      info: infoText,
      author
    } = metadata || '';

    const postTitle = data.title || '';
    const postDate = data.metadata.date || '';
    const isSourceValid = validateImgSource(data.metadata.img);
    let postImage = data.metadata.img || '';
    if (!isSourceValid) {
      const defaultNumber = Math.floor((Math.random() * 3) + 1);
      postImage = defaultNumber === 1 ? defaultPostImg1 : defaultNumber === 2 ? defaultPostImg2 : defaultPostImg3;
    }

    return (
      <div className={`${showDetails ? 'preview_post detailed_post' : 'preview_post'}`} key={data._id} onClick={this.displayDetails}>
        <div className="preview_post-date">{postDate}</div>
        <div className="preview_post-title">{postTitle}</div>
        {postImage && <img src={postImage} alt="bkg" className="preview_post-img"/>}
        {showDetails &&
          <span className="active-post-header-text active-post-header-text-title">About:</span>}
        {showDetails && <div className="preview_post-text">{aboutText}</div>}
        {showDetails &&
          <div>
            <span className="active-post-header-text active-post-header-text-title">Actions:</span>
            <span className="preview_post-text">{actionsText}</span>
            <span className="active-post-header-text active-post-header-text-title">Info:</span>
            <span className="preview_post-text">{infoText}</span>
            <span className="active-post-header-text active-post-header-text-title">Author:</span>
            <span className="preview_post-text">{author}</span>
        </div>}
      </div>
     );
   }
}

export default PostDetails;
