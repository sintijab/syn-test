import React from 'react';
import { getCookie } from '../functions.js';
import arrowIconUp from '../img/arrow-up2.png';
import arrowIconDown from '../img/arrow-down.png';
import additionIcon from '../img/addition.png';
import menuIcon from '../img/menu2.png';
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
    }
    this.expandMenu = this.expandMenu.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
  }

  expandMenu() {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }

  toggleOverlay() {
    const { displayOverlay } = this.state;
    this.setState({ displayOverlay: !displayOverlay });
  }


  render() {
    const { isMobile, loggedIn, menuVisible, displayOverlay } = this.state;
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
              {menuVisible && displayOverlay && <PostForm toggleOverlay={this.toggleOverlay} />}
         </div>
       );
      }
    return <div />;
   }
}

export default Menu;
