import React from 'react';
import { connect } from 'react-redux';
import nextBtn from '../img/arrow.png';
import saveBtn from '../img/like.png';
import saveBtnActive from '../img/like2.png';
import { getCookie } from '../functions.js';
import { getUserDetailsAction } from '../actions/profileActions.js';

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
    this.editUserDetails = this.editUserDetails.bind(this);
  }

  componentDidUpdate() {
    const { cosmic, profileData } = this.props;
    const { activePost, userData } = this.state;
    if (cosmic && cosmic.posts && cosmic.posts.length && !activePost) {
      this.setState({ activePost: cosmic.posts[0], activeIndex: 0 });
    }

    if (profileData.type === 'GET_PROFILE' && !userData) {
      this.setState({
        userData: profileData.profileDetails,
      })
    }
  }

  expandInfo() {
    const { showFullInfo } = this.state;
    this.setState({ showFullInfo: !showFullInfo });
  }

  nextItem() {
    const { cosmic, firstIndex } = this.props;
    const { activeIndex } = this.state;
    if (cosmic && cosmic.posts && cosmic.posts.length) {
      const nextIndex = activeIndex ? activeIndex : firstIndex;
      this.setState({ activePost: cosmic.posts[nextIndex + 1], activeIndex: nextIndex + 1 });
    }
  }

  editUserDetails(postId, storePostToAccount) {
    const { userData } = this.state;
    const Cosmic = require('cosmicjs')({
      token: getCookie('val') // optional
    })
    Cosmic.getBuckets()
    .then(data => {
      let bucket = Cosmic.bucket({
        slug: data.buckets[0].slug,
        write_key: data.buckets[0].api_access.write_key
      })
      let mail = getCookie('sId');
      let adjustedEmail = mail.replace("@", "");
      let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");
      const userPostIds = userData.object.metafields.filter(obj => obj.key === 'storedPostIds');
      const userIdMetadield = userData.object.metafields.filter(obj => obj.key === 'uid');
      const userNameMetadield = userData.object.metafields.filter(obj => obj.key === 'uname');
      const userEmailMetadield = userData.object.metafields.filter(obj => obj.key === 'email');
      const userSubmittedPostIds = userData.object.metafields.filter(obj => obj.key === 'submittedPostIds');

      let newStoredPosts =  ``;
      const userSubmittedPosts = userSubmittedPostIds.length ? `${userSubmittedPostIds[0].value}` : ``;
      if (userPostIds.length) {
        let newStoredPosts = `${userPostIds[0].value}`;
        let replaceableId = `${postId}`;
        let replaceableIdList = `, ${postId}`;
        if (newStoredPosts.indexOf(replaceableIdList) !== -1 && !storePostToAccount) {
          newStoredPosts.replace(replaceableIdList, ``);
        } else if (newStoredPosts.indexOf(replaceableId) !== -1 && !storePostToAccount) {
          newStoredPosts.replace(replaceableId, ``);
        } else if (storePostToAccount) {
          newStoredPosts = `${userPostIds[0].value}, ${postId}`;
        }
      } else {
        newStoredPosts = `${postId}`;
      }
      localStorage.setItem('storedPostIds', newStoredPosts);


      bucket.editObject({
        slug: emailEncoded,
        metafields: [
          {
            value: userSubmittedPosts,
            key: 'submittedPostIds',
            title: 'submittedPostIds',
            type: 'text',
            children: null
          },
          {
            value: newStoredPosts,
            key: 'storedPostIds',
            title: 'storedPostIds',
            type: 'text',
            children: null
          },
          {
            value: userIdMetadield[0].value,
            key: 'uid',
            title: 'uid',
            type: 'text',
            children: null
          },
          {
            value: userNameMetadield[0].value,
            key: 'uname',
            title: 'userName',
            type: 'text',
            children: null
          },
          {
            value: userEmailMetadield[0].value,
            key: 'email',
            title: 'userMail',
            type: 'text',
            children: null
          }]
      }).catch(err => {
        console.log(err)
      })
    })
    this.props.getPostsAction();
  }

  savePost() {
    const { btnActiveState, activePost } = this.state;
    this.props.getUserDetailsAction();

    if (activePost && !btnActiveState) {
      this.setState({ btnActiveState: !btnActiveState });
      this.editUserDetails(activePost._id, true);
    } else if (activePost && btnActiveState) {
      this.setState({ btnActiveState: !btnActiveState });
      this.editUserDetails(activePost._id, false);
    }
  }


  render() {
    const { isMobile, loggedIn, firstPost, firstIndex } = this.props;
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
            <img alt="next" src={saveBtn} className="active-post-btn-save" onClick={this.savePost} />
            {btnActiveState && <img alt="next" src={saveBtnActive} className="active-post-btn-save" onClick={this.savePost} />}
         </div>
       );
      }
    return <div />;
   }
}

const mapStateToProps = state => ({
  profileData: state.profileData,
})

export default connect(mapStateToProps, { getUserDetailsAction })(Post);
