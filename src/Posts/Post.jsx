import React from 'react';

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activePost: null,
      showFullInfo: false,
    }
    this.expandInfo = this.expandInfo.bind(this);
  }

  componentDidUpdate() {
    const { cosmic } = this.props;
    const { activePost } = this.state;
    if (cosmic && cosmic.posts && cosmic.posts.length && !activePost) {
      this.setState({ activePost: cosmic.posts[0] });
    }
  }

  expandInfo() {
    const { showFullInfo } = this.state;
    this.setState({ showFullInfo: !showFullInfo });
  }

  render() {
    const { isMobile, loggedIn } = this.props;
    const { activePost,  showFullInfo } = this.state;
      if (isMobile && loggedIn && activePost) {
        const postHeaderClassName = showFullInfo ? "active-post-header active-post-header-active" : "active-post-header";
        const postHeaderTextClassName = showFullInfo ? "active-post-header-text" : "active-post-header-about";
        const postHeaderImgClassName = showFullInfo ? "active-post-img active-post-img-active" : "active-post-img";
        const postHeaderTextTitleClassName = showFullInfo ? "active-post-header-title active-post-header-title-active" : "active-post-header-title";
        const detailedInformation = (
          <div>
            <span className="active-post-header-text active-post-header-text-title">Actions:</span>
            <span className={postHeaderTextClassName}>{activePost.metadata.actions}</span>
            <span className="active-post-header-text active-post-header-text-title">Info:</span>
            <span className={postHeaderTextClassName}>{activePost.metadata.info}</span>
            <span className="active-post-header-text active-post-header-text-title">Author:</span>
            <span className={postHeaderTextClassName}>{activePost.metadata.author}</span>
          </div>);
        return (
          <div className="active-post">
            <div className={postHeaderClassName} onClick={this.expandInfo}>
              <span className={postHeaderTextTitleClassName}>{activePost.title}</span>
              {showFullInfo && <br/>}
              {showFullInfo &&
                <span className="active-post-header-text active-post-header-text-title">About:</span>}
              <span className={postHeaderTextClassName}>{activePost.metadata.about}</span>
              {showFullInfo && detailedInformation}
            </div>
            {activePost.metadata.img && <img src={activePost.metadata.img} alt="bkg" className={postHeaderImgClassName} />}
         </div>
       );
      }
    return <div />;
   }
}

export default Post;
