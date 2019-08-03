import React from 'react';
import { getCookie } from '../functions.js';
import arrowIconUp from '../img/arrow-up2.png';
import arrowIconDown from '../img/arrow-down.png';
import additionIcon from '../img/addition.png';
import menuIcon from '../img/menu2.png';
import checkmark from '../img/checkmark.png';
import Tabs from './Tabs.jsx';
import PostForm from './PostForm';

class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      isMobile: !!(window.innerWidth < 479),
      menuVisible: false,
      displayOverlay: false,
      postSubmitted: false,
    }
    this.expandMenu = this.expandMenu.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.postSubmitted = this.postSubmitted.bind(this);
  }

  expandMenu() {
    const { menuVisible, postSubmitted } = this.state;
    this.setState({ menuVisible: !menuVisible });
    if (postSubmitted) {
      this.setState({ postSubmitted: false });
    }
  }

  componentDidUpdate() {
    const { menuVisible, displayOverlay } = this.state;
    if (!menuVisible && displayOverlay) {
      this.setState({ displayOverlay: false });
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
    const { isMobile, loggedIn, menuVisible, displayOverlay, postSubmitted } = this.state;
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
                {menuVisible && <Tabs isMobile loggedIn menuVisible />}
              </div>
              {menuVisible && <img alt="menu" src={additionIcon} className="addition-icon" onClick={this.toggleOverlay}/>}
              {menuVisible && postSubmitted && !displayOverlay &&
                <div className="sumbit_success">
                <img src={checkmark} alt="success" className="submit-success-img"/>
                  Thank you! Your post has been published successfully.
                </div>}
              {menuVisible && displayOverlay && <PostForm toggleOverlay={this.toggleOverlay} submit={this.postSubmitted}/>}
         </div>
       );
      }
    return <div />;
   }
}

export default Menu;
