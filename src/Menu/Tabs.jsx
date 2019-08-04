import React from 'react';
import menuIcon1 from '../img/menu01.png';
import menuIcon2 from '../img/menu02.png';
import menuIcon3 from '../img/menu03.png';
import menuIcon4 from '../img/menu04.png';

class Tabs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: null,
    }
  }


  render() {
    const { isMobile, loggedIn, menuVisible } = this.props;
      if (isMobile && loggedIn && menuVisible) {
        return (
          <div className="nav">
            <ul className="nav_list">
              <li className="nav_icon"><img alt="menu" src={menuIcon1} className="nav_icon-img" /></li>
              <li className="nav_icon"><img alt="menu" src={menuIcon2} className="nav_icon-img" /></li>
              <li className="nav_icon"><img alt="menu" src={menuIcon3} className="nav_icon-img" /></li>
              <li className="nav_icon"><img alt="menu" src={menuIcon4} className="nav_icon-img" /></li>
            </ul>
         </div>
       );
      }
    return <div />;
   }
}

export default Tabs;
