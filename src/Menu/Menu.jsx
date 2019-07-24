import React from 'react';
import { getCookie } from '../functions.js';
import arrowIconUp from '../img/arrow-up.png';
import arrowIconDown from '../img/arrow-down.png';
import menuIcon from '../img/menu.png';
import Tabs from './Tabs.jsx';

class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      isMobile: !!(window.innerWidth < 479),
      menuVisible: false,
    }
    this.expandMenu = this.expandMenu.bind(this);
  }

  expandMenu() {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }


  render() {
    const { isMobile, loggedIn, menuVisible } = this.state;
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
         </div>
       );
      }
    return <div />;
   }
}

export default Menu;
