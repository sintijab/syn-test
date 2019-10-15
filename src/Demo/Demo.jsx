import React from 'react';
import { getCookie } from '../functions.js';
import device01 from '../img/device01.png';
import device02 from '../img/device02.png';
import device03 from '../img/device03.png';

class Demo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      isMobile: !!(window.innerWidth < 479),
    }
  }

  render() {
    const { isMobile, loggedIn } = this.state;
      if (!isMobile && !loggedIn) {
        return (
          <div className="device-frame">
            <img src={device01} className="device" alt="bg" />
            <img src={device02} className="device" alt="bg" />
            <img src={device03} className="device" alt="bg" />
         </div>
       );
      }
    return <div />;
   }
}

export default Demo;
