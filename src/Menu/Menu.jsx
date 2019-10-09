import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../functions.js';
import { signInAction } from '../actions/signActions.js';
import { fetchPostAction, getPostsAction } from '../actions/postActions.js';
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
      userStoredPosts: localStorage.getItem('storedPostIds'),
      isMobile: !!(window.innerWidth < 479),
      menuVisible: false,
      displayOverlay: false,
      postSubmitted: false,
      activeTab: null,
    }
    this.expandMenu = this.expandMenu.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.postSubmitted = this.postSubmitted.bind(this);
    this.setTabActive = this.setTabActive.bind(this);

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

  componentDidUpdate() {
    const { menuVisible, displayOverlay, loggedIn, isMobile } = this.state;
    const { signType } = this.props;
    if (!menuVisible && displayOverlay) {
      this.setState({ displayOverlay: false });
    }
    if (signType === 'LOGGED_IN' && isMobile && !loggedIn) {
      this.setState({ loggedIn: true });
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
    const { isMobile, loggedIn, menuVisible, displayOverlay, postSubmitted, userId, userStoredPosts, activeTab } = this.state;
    const { postsState = [] } = this.props;
    const submittedPosts = postsState.length ? postsState.filter(obj => obj.metadata.author === userId) : [];
    const storedPosts = postsState.length ? postsState.filter(obj => userStoredPosts.indexOf(obj.metadata.postId) !== -1) : [];
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
                {menuVisible && submittedPosts.length && activeTab === (null || 'stored') && <PostsPreview posts={storedPosts} />}
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
  postsState: state.postsState.postsData,
})

export default connect(mapStateToProps, { signInAction, fetchPostAction, getPostsAction })(Menu);
