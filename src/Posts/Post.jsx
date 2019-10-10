import React from 'react';
import { connect } from 'react-redux';
import nextBtn from '../img/arrow.png';
import saveBtn from '../img/like.png';
import saveBtnActive from '../img/like2.png';
import { getUserDetailsAction, editUserDetailsAction } from '../actions/profileActions.js';
import { nextPostAction } from '../actions/postActions.js';

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activePost: null,
      showFullInfo: false,
      activeIndex: null,
      btnActiveState: false,
      userData: null,
    }
    this.expandInfo = this.expandInfo.bind(this);
    this.nextItem = this.nextItem.bind(this);
    this.savePost = this.savePost.bind(this);
  }

  componentDidUpdate() {
    const { cosmic, profileData, nextPostState } = this.props;
    const { activePost, userData, btnActiveState } = this.state;
    if (cosmic && cosmic.posts && cosmic.posts.postsData.length && !activePost && userData) {
      this.setState({ activePost: cosmic.posts.postsData[0], activeIndex: 0 });
      if (userData.object.metadata.storedPostIds.indexOf(cosmic.posts.postsData[0]._id) !== -1 && !btnActiveState) {
        this.setState({ btnActiveState: true });
      }
    }

    if (profileData.type === 'GET_PROFILE' && !userData) {
      this.setState({
        userData: profileData.profileDetails,
      })
    }
    if (userData && activePost && nextPostState.postsState && nextPostState.postsState.type === 'NEXT_POST') {
      if (userData.object.metadata.storedPostIds.indexOf(activePost._id) !== -1 && !btnActiveState) {
        this.setState({ btnActiveState: !btnActiveState });
      } else if (userData.object.metadata.storedPostIds.indexOf(activePost._id) === -1 && btnActiveState) {
        this.setState({ btnActiveState: !btnActiveState });
      }
    }
  }

  expandInfo() {
    const { showFullInfo } = this.state;
    this.setState({ showFullInfo: !showFullInfo });
  }

  nextItem() {
    const { cosmic, firstIndex } = this.props;
    const { activeIndex } = this.state;
    if (cosmic && cosmic.posts && cosmic.posts.postsData.length) {
      const nextIndex = activeIndex ? activeIndex : firstIndex;
      this.setState({ activePost: cosmic.posts.postsData[nextIndex + 1], activeIndex: nextIndex + 1 });
      this.props.nextPostAction();
    }
  }

  savePost() {
    const { btnActiveState, activePost, userData } = this.state;
    this.setState({ btnActiveState: !btnActiveState });

    if (activePost && !btnActiveState) {
      this.props.editUserDetailsAction(userData, activePost._id, true, 'store');
    } else if (activePost && btnActiveState) {
      this.props.editUserDetailsAction(userData, activePost._id, false, 'store');
    }
  }


  render() {
    const { isMobile, loggedIn, firstPost } = this.props;
    const { activePost,  showFullInfo, btnActiveState } = this.state;
      if (isMobile && loggedIn && firstPost) {
        const postHeaderClassName = showFullInfo ? "active-post-header active-post-header-active" : "active-post-header";
        const postHeaderTextClassName = showFullInfo ? "active-post-header-text" : "active-post-header-about";
        const postHeaderImgClassName = showFullInfo ? "active-post-img active-post-img-active" : "active-post-img";
        const postHeaderTextTitleClassName = showFullInfo ? "active-post-header-title active-post-header-title-active" : "active-post-header-title";
        const detailedInformation = (
          <div>
            <span className="active-post-header-text active-post-header-text-title">Actions:</span>
            <span className={postHeaderTextClassName}>{activePost ? activePost.metadata.actions : firstPost.metadata.actions}</span>
            <span className="active-post-header-text active-post-header-text-title">Info:</span>
            <span className={postHeaderTextClassName}>{activePost ? activePost.metadata.info : firstPost.metadata.info}</span>
            <span className="active-post-header-text active-post-header-text-title">Author:</span>
            <span className={postHeaderTextClassName}>{activePost ? activePost.metadata.author : firstPost.metadata.author}</span>
          </div>);
        return (
          <div className="active-post">
            <div className={postHeaderClassName} onClick={this.expandInfo}>
              <span className={postHeaderTextTitleClassName}>{activePost ? activePost.title : firstPost.title}</span>
              {showFullInfo && <br/>}
              {showFullInfo &&
                <span className="active-post-header-text active-post-header-text-title">About:</span>}
              <span className={postHeaderTextClassName}>{activePost ? activePost.metadata.about : firstPost.metadata.about}</span>
              {showFullInfo && detailedInformation}
            </div>
            {(firstPost.metadata.img || activePost.metadata.img) &&
              <img src={activePost ? activePost.metadata.img : firstPost.metadata.img} alt="bkg" className={postHeaderImgClassName} />}
            <img alt="next" src={nextBtn} className="active-post-btn-next" onClick={this.nextItem} />
            <img alt="next" src={`${btnActiveState ? saveBtnActive : saveBtn}`} className="active-post-btn-save" onClick={this.savePost} />
         </div>
       );
      }
    return <div />;
   }
}

const mapStateToProps = state => ({
  profileData: state.profileData,
  nextPostState: state,
})

export default connect(mapStateToProps, { getUserDetailsAction, editUserDetailsAction, nextPostAction })(Post);
