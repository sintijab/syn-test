import React from 'react';
import { connect } from 'react-redux';
import nextBtn from '../img/arrow.png';
import saveBtn from '../img/like.png';
import saveBtnActive from '../img/like2.png';
import { getUserDetailsAction, editUserDetailsAction } from '../actions/profileActions.js';
import { nextPostAction } from '../actions/postActions.js';
import { validateImgSource } from '../functions.js';
import defaultPostImg1 from '../img/default001.png';
import defaultPostImg2 from '../img/default002.png';
import defaultPostImg3 from '../img/default003.png';

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activePost: null,
      showFullInfo: false,
      activeIndex: null,
      btnActiveState: false,
      userData: null,
      storedPostIds: null,
      disableBtnValidation: false,
    }
    this.expandInfo = this.expandInfo.bind(this);
    this.nextItem = this.nextItem.bind(this);
    this.savePost = this.savePost.bind(this);
  }

  componentDidUpdate() {
    const { postsByLocation, profileData, nextPostState } = this.props;
    const { activePost, userData, btnActiveState, storedPostIds, disableBtnValidation } = this.state;
    if (postsByLocation && postsByLocation.length && !activePost && userData) {
      this.setState({ activePost: postsByLocation[0], activeIndex: 0 });
      if (userData.object.metadata.storedPostIds && userData.object.metadata.storedPostIds.indexOf(postsByLocation[0]._id) !== -1 && !btnActiveState) {
        this.setState({ btnActiveState: true });
      }
      if (profileData && profileData.profileDetails) {
        this.setState({
          userData: profileData.profileDetails,
        })
      }
    }

    if (profileData.type === 'GET_PROFILE' && !userData) {
      this.setState({
        userData: profileData.profileDetails,
        storedPostIds: profileData.profileDetails.object.metadata.storedPostIds
      })
    }
    if (userData && profileData.profileUpdateDetails && profileData.profileUpdateDetails.object.metadata.storedPostIds !== storedPostIds) {
        this.setState({ storedPostIds: profileData.profileUpdateDetails.object.metadata.storedPostIds })
    }

    if (userData && activePost && nextPostState.postsState && nextPostState.postsState.type === 'NEXT_POST' &&
      storedPostIds.indexOf(activePost._id) !== -1 && !btnActiveState && !disableBtnValidation) {
      this.setState({ btnActiveState: true });
    } else if (userData && activePost && nextPostState.postsState && nextPostState.postsState.type === 'NEXT_POST' &&
      storedPostIds.indexOf(activePost._id) === -1 && btnActiveState && !disableBtnValidation) {
        this.setState({ btnActiveState: false });
    }
  }

  componentDidMount() {
    const { firstPost } = this.props;
    if (firstPost) {
      this.setState({
        activePost: firstPost,
      })
    }
  }

  expandInfo() {
    const { showFullInfo } = this.state;
    this.setState({ showFullInfo: !showFullInfo });
  }

  nextItem() {
    const { postsByLocation, firstIndex, firstPost } = this.props;
    const { activePost } = this.state;
    if (postsByLocation && postsByLocation.length) {
      const nextItemIndex = (postsByLocation.indexOf(activePost) !== -1 && postsByLocation.indexOf(activePost) !== 0) ?
        postsByLocation.indexOf(activePost) + 1 : firstIndex + 1;
      const nextIndex = postsByLocation && nextItemIndex !== postsByLocation.length ? nextItemIndex : firstIndex;
      this.setState({ activePost: postsByLocation[nextIndex], activeIndex: nextIndex, disableBtnValidation: false });
      window.history.replaceState(window.location.href, '', `/${postsByLocation[nextIndex].slug}`)
      this.props.nextPostAction();
    }
  }

  savePost() {
    const { btnActiveState, activePost, userData } = this.state;
    this.setState({ btnActiveState: !btnActiveState, disableBtnValidation: true });
    if (activePost && !btnActiveState) {
      this.props.editUserDetailsAction(userData, activePost._id, true, 'store');
    } else if (activePost && btnActiveState) {
      this.props.editUserDetailsAction(userData, activePost._id, false, 'store');
    }
  }


  render() {
    const { isMobile, loggedIn } = this.props;
    const { activePost,  showFullInfo, btnActiveState } = this.state;

      if (isMobile && activePost) {
        const post = activePost;
        let isSourceValid = validateImgSource(post.metadata.img);
        if (post.metadata.author === 'info@syn4ny.com') { isSourceValid = true; }
        if (!isSourceValid) {
          const defaultNumber = Math.floor((Math.random() * 3) + 1);
          post.metadata.img = defaultNumber === 1 ? defaultPostImg1 : defaultNumber === 2 ? defaultPostImg2 : defaultPostImg3;
        }
        const postHeaderClassName = showFullInfo ? "active-post-header active-post-header-active" : "active-post-header";
        const postHeaderTextClassName = showFullInfo ? "active-post-header-text" : "active-post-header-about";
        const postHeaderImgClassName = showFullInfo ? "active-post-img active-post-img-active" : "active-post-img";
        const postHeaderTextTitleClassName = showFullInfo ? "active-post-header-title active-post-header-title-active" : "active-post-header-title";
        const detailedInformation = (
          <div>
            <span className="active-post-header-text active-post-header-text-title">Actions:</span>
            <span className={postHeaderTextClassName}>{post.metadata.actions}</span>
            <span className="active-post-header-text active-post-header-text-title">Info:</span>
            <span className={postHeaderTextClassName}>{post.metadata.info}</span>
            <span className="active-post-header-text active-post-header-text-title">Author:</span>
            <span className={postHeaderTextClassName}>{post.metadata.author}</span>
          </div>);
        return (
          <div className="active-post">
            <div className={postHeaderClassName} onClick={this.expandInfo}>
              <span className={postHeaderTextTitleClassName}>{post.title}</span>
              {showFullInfo && <br/>}
              {showFullInfo &&
                <span className="active-post-header-text active-post-header-text-title">About:</span>}
              <span className={postHeaderTextClassName}>{post.metadata.about}</span>
              {showFullInfo && detailedInformation}
            </div>
            {post.metadata.img &&
              <img src={post.metadata.img} alt="bkg" className={postHeaderImgClassName} />}
            {loggedIn && <img alt="next" src={nextBtn} className="active-post-btn-next" onClick={this.nextItem} />}
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
