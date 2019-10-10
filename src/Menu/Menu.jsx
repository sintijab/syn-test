import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../functions.js';
import { signInAction } from '../actions/signActions.js';
import { fetchPostAction, getPostsAction, updateUserStoredPostsAction } from '../actions/postActions.js';
import { getUserDetailsAction, editUserDetailsAction } from '../actions/profileActions.js';
import arrowIconUp from '../img/arrow-up2.png';
import arrowIconDown from '../img/arrow-down.png';
import additionIcon from '../img/addition.png';
import menuIcon from '../img/menu2.png';
import checkmark from '../img/checkmark.png';
import Tabs from './Tabs.jsx';
import PostForm from './PostForm';
import PostsPreview from './PostsPreview';

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
      userSubmittedPosts: [],
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

  getUserPosts(profileDetails, postsState) {
    const storedPostIds = profileDetails.object.metadata.storedPostIds;
    const submittedPostIds = profileDetails.object.metadata.submittedPostIds;

    if (storedPostIds.length || storedPostIds === '') {
      const filteredStoredPosts = postsState.length ? postsState.filter(obj => storedPostIds.indexOf(obj._id) !== -1) : [];
      this.setState({
        storedPosts: filteredStoredPosts,
        userStoredPosts: storedPostIds,
      })
    }
    if (submittedPostIds.length || submittedPostIds === '') {
      const filteredSubmittedPosts = postsState.length ? postsState.filter(obj => obj.metadata.author === profileDetails.author) : [];
      this.setState({
        submittedPosts: filteredSubmittedPosts,
        userSubmittedPosts: submittedPostIds,
      })
    }
  }


  componentDidUpdate() {
    const { menuVisible, displayOverlay, loggedIn, isMobile, userData, postsState, storedPosts, submittedPosts, userStoredPosts, userSubmittedPosts  } = this.state;
    const { signType, profileData, posts } = this.props;
    if (!menuVisible && displayOverlay) {
      this.setState({ displayOverlay: false });
    }
    if (signType === 'LOGGED_IN' && isMobile && !loggedIn) {
      this.setState({ loggedIn: true });
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
      this.setState({
        postsState: posts.postsData,
        activePost: posts.postsData[0],
        activeIndex: 0,
        loading: false,
        fetchPosts: true,
        loggedIn: true,
      });
    }
    if ((profileData.profileUpdateDetails || profileData.profileDetails) && postsState.length) {
      const storeDataType = profileData.profileUpdateDetails ? profileData.profileUpdateDetails : profileData.profileDetails;
      const storedPostIds = storeDataType.object.metadata.storedPostIds;
      const submittedPostIds = storeDataType.object.metadata.submittedPostIds;

      const updateUserStoredPosts = storedPostIds && storedPostIds.length && (storedPosts.length === 0 || userStoredPosts.length !== storedPostIds.length);
      const updateUserSubmittedPosts = submittedPostIds && submittedPostIds.length &&
        (submittedPosts.length === 0 || userSubmittedPosts.length !== submittedPostIds.length);
      if (profileData && postsState && (updateUserStoredPosts || updateUserSubmittedPosts)) {
        this.getUserPosts(storeDataType, postsState);
      }
    }
  }

  componentDidMount() {
    this.props.getUserDetailsAction();
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
    const { isMobile, loggedIn, menuVisible, displayOverlay, postSubmitted, userId, userStoredPosts, activeTab, postsState, submittedPosts, storedPosts } = this.state;

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
  posts: state.postsState,
  profileData: state.profileData,
})

export default connect(mapStateToProps, { signInAction, fetchPostAction, getPostsAction, getUserDetailsAction, editUserDetailsAction, updateUserStoredPostsAction })(Menu);
