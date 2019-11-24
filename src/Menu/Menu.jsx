import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../functions.js';
import { signInAction } from '../actions/signActions.js';
import { fetchPostAction, getPostsAction, updateUserStoredPostsAction, addPostAction } from '../actions/postActions.js';
import { getUserDetailsAction, editUserDetailsAction } from '../actions/profileActions.js';
import arrowIconUp from '../img/arrow-up2.png';
import arrowIconDown from '../img/arrow-down.png';
import additionIcon from '../img/addition.png';
import menuIcon from '../img/menu2.png';
import checkmark from '../img/checkmark.png';
import Tabs from './Tabs.jsx';
import PostForm from './PostForm';
import PostsPreview from './PostsPreview';
import SettingsView from './SettingsView';

class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      userId: getCookie('sId'),
      isMobile: !!(window.innerWidth < 479),
      menuVisible: false,
      displayOverlay: false,
      postSubmitted: false,
      activeTab: 'stored',
      userData: null,
      postsState: [],
      storedPosts: [],
      submittedPosts: [],
      userStoredPosts: [],
      location: getCookie('location'),
    }
    this.expandMenu = this.expandMenu.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.postSubmitted = this.postSubmitted.bind(this);
    this.setTabActive = this.setTabActive.bind(this);
    this.getUserPosts = this.getUserPosts.bind(this);

  }

  expandMenu() {
    const { menuVisible, postSubmitted } = this.state;
    this.setState({ menuVisible: !menuVisible });
    if (postSubmitted) {
      this.setState({ postSubmitted: false });
    }
  }

  setTabActive(type) {
    const { activeTab } = this.state;
    if (activeTab !== type) {
      this.setState({ activeTab: type });
    }
  }

  getUserPosts(storedPostIds, postsState) {
    const { userId } = this.state;
    if (storedPostIds.length || storedPostIds === '') {
      const filteredStoredPosts = postsState.length ? postsState.filter(obj => storedPostIds.indexOf(obj._id) !== -1) : [];
      const filterSubmittedPosts = postsState.length ? postsState.filter(obj => obj.metadata.author === userId) : [];
      this.setState({
        storedPosts: filteredStoredPosts,
        userStoredPosts: storedPostIds,
        submittedPosts: filterSubmittedPosts,
      })
    }
  }


  componentDidUpdate() {
    const { menuVisible, displayOverlay, loggedIn, isMobile, userData, userId, postsState, storedPosts, submittedPosts, userStoredPosts } = this.state;
    const { signType, profileData, posts, post, uEmail } = this.props;
    if (!menuVisible && displayOverlay) {
      this.setState({ displayOverlay: false });
    }
    if (signType === 'LOGGED_IN' && isMobile && !loggedIn && !userId && uEmail) {
      this.setState({ loggedIn: true, userId: uEmail });
    }

    if (profileData.type === 'GET_PROFILE' && !userData) {
      this.setState({
        userData: profileData.profileDetails,
      })
    } else if (profileData.type === 'PROFILE_UPDATED' && profileData.profileUpdateDetails.object.metadata.storedPostIds !== userData.object.metadata.storedPostIds) {
      this.setState({
        userData: profileData.profileUpdateDetails,
        userStoredPosts: profileData.profileUpdateDetails.object.metadata.storedPostIds,
      })

      this.getUserPosts(profileData.profileUpdateDetails, postsState);
    }
    if (posts.type === 'POSTS_FETCHED' && !postsState.length) {
      const uLocation = getCookie('location')
      const filterPostsByLocation = posts.postsData.filter(post => post.metadata.location === uLocation || post.metadata.location === 'Global');
      this.setState({
        postsState: filterPostsByLocation,
        activePost: filterPostsByLocation[0],
        activeIndex: 0,
        loading: false,
        fetchPosts: true,
        loggedIn: true,
        location: getCookie('location'),
      });
    }

    if ((profileData.profileUpdateDetails || signType === 'LOGGED_IN') && (submittedPosts.length !== postsState.filter(obj => obj.metadata.author === userId).length ||
      userStoredPosts.length !== profileData.profileUpdateDetails.object.metadata.storedPostIds.length)) {
        const uData = profileData.profileUpdateDetails;
        const storedPostIds = uData.object.metadata.storedPostIds;
        const updateUserStoredPosts = (storedPostIds && storedPostIds.length && storedPosts.length === 0) || userStoredPosts.length !== storedPostIds.length;
        if (uData && postsState && (updateUserStoredPosts)) {
          this.getUserPosts(storedPostIds, postsState);
        }
      }
    const hasRequiredData = userData && userData.object.metadata.storedPostIds && postsState && !!postsState.length && userStoredPosts;
    if (hasRequiredData !== null) {
      const hasStoredPosts = userStoredPosts.length !== userData.object.metadata.storedPostIds.length;
      const hasSubmittedPosts = submittedPosts.length !== postsState.filter(obj => obj.metadata.author === userId).length;
      if (hasStoredPosts || hasSubmittedPosts) {
        const storedPostIds = userData.object.metadata.storedPostIds;
        const updateUserStoredPosts = storedPostIds && storedPostIds.length && (storedPosts.length === 0 || userStoredPosts.length !== storedPostIds.length);
        if (userData && postsState && (updateUserStoredPosts || hasSubmittedPosts)) {
          this.getUserPosts(storedPostIds, postsState);
        }
      }
      }

    if (post && post.type && post.type === 'POST_ADDED' &&
      post.postData && post.postData.object.metadata.author === userId && !submittedPosts.filter(obj => obj._id === post.postData.object._id).length) {
        let updatedSubmittedPosts = submittedPosts;
        let createdPost = post.postData.object || {};
        updatedSubmittedPosts.push(createdPost);
        if (!submittedPosts.length || submittedPosts.length !== updatedSubmittedPosts.length) {
          this.setState({
            submittedPosts: updatedSubmittedPosts,
          });
        }
    }
  }

  toggleOverlay() {
    const { displayOverlay, postSubmitted } = this.state;
    this.setState({ displayOverlay: !displayOverlay });
    if (postSubmitted) {
      this.setState({ postSubmitted: false });
    }
  }

  postSubmitted(formSubmitted = false) {
    const { postSubmitted } = this.state;
      this.toggleOverlay();
      if (!postSubmitted) {
        this.setState({ postSubmitted: true });
      }
  }

  render() {
    const { isMobile, loggedIn, menuVisible, displayOverlay, postSubmitted, userId, activeTab, submittedPosts, storedPosts, userData } = this.state;

    const menuClass = menuVisible ? "menu_nav--open" : "menu_nav--open menu_nav--closed";
    const menuHeaderClass = !menuVisible ? "menu menu--closed" : "menu";
      if (isMobile && loggedIn) {
        return (
          <div>
              <div className={menuHeaderClass} onClick={this.expandMenu}>
                <img alt="menu" src={menuIcon} className="menu_icon" />
              {!menuVisible &&
                <img alt="menu" src={arrowIconUp} className="arrow_icon--menu" />}
              </div>
               <div className={menuClass}>
                 {menuVisible &&
                  <div className="menu menu_header" onClick={this.expandMenu}>
                     <img alt="menu" src={arrowIconDown} className="arrow_icon--menu" />
                  </div>}
                {menuVisible && <Tabs isMobile loggedIn menuVisible setTabActive={this.setTabActive} activeTab={activeTab}/>}
                {menuVisible && storedPosts.length && activeTab === (null || 'stored') && <PostsPreview posts={storedPosts} />}
                {menuVisible && submittedPosts.length && activeTab === 'submitted' && <PostsPreview posts={submittedPosts} />}
                {menuVisible && activeTab === 'settings' && <SettingsView mail={userId} data={userData}/>}
              </div>
              {menuVisible && <img alt="menu" src={additionIcon} className="addition-icon" onClick={this.toggleOverlay}/>}
              {menuVisible && postSubmitted && !displayOverlay &&
                <div className="sumbit_success">
                <img src={checkmark} alt="success" className="submit-success-img"/>
                  Thank you! Your post has been published successfully.
                </div>}
              {menuVisible && displayOverlay && <PostForm toggleOverlay={this.toggleOverlay} submit={this.postSubmitted} />}

         </div>
       );
      }
    return <div />;
   }
}

const mapStateToProps = state => ({
  error: state.error,
  signType: state.signInStatus.type,
  uEmail: state.signInStatus.uData,
  posts: state.postsState,
  profileData: state.profileData,
  post: state.postsState,
})

export default connect(mapStateToProps, { signInAction, fetchPostAction, getPostsAction, getUserDetailsAction, editUserDetailsAction, updateUserStoredPostsAction, addPostAction })(Menu);
