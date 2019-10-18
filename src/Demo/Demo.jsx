import React from 'react';
import { getCookie } from '../functions.js';
import device01 from '../img/device01.png';
import device02 from '../img/device02.png';
import device03 from '../img/device03.png';
import * as gallery from './indexImg.js';

class Demo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      isMobile: !!(window.innerWidth < 479),
      activeImgSrcFirstSection: 0,
      activeImgSrcSecondSection: 1,
      activeImgSrcThirdSection: 2,
    }
    this.getDemoSrc = this.getDemoSrc.bind(this);
  }

  componentDidUpdate() {
    const { activeImgSrcThirdSection} = this.state;
    if (activeImgSrcThirdSection < 116) {
      this.getDemoSrc();
    } else {
      this.setState({ activeImgSrcFirstSection: 0, activeImgSrcSecondSection: 1, activeImgSrcThirdSection: 2  });
    }
  }

  getDemoSrc() {
    const { activeImgSrcFirstSection, activeImgSrcSecondSection, activeImgSrcThirdSection} = this.state;
    const _this = this;

      setTimeout(() => {
        _this.setState({
          activeImgSrcFirstSection: activeImgSrcFirstSection + 3,
          activeImgSrcSecondSection: activeImgSrcSecondSection + 3,
          activeImgSrcThirdSection: activeImgSrcThirdSection + 3,
        })}, 6000);
  }

  componentDidMount() {
    this.getDemoSrc();
  }

  render() {
    const { isMobile, loggedIn, activeImgSrcFirstSection, activeImgSrcSecondSection, activeImgSrcThirdSection } = this.state;
    let images = gallery;

      if (!isMobile && !loggedIn) {
        return (
          <div>
            <div className="device-bg">
              <div className="device-bg-sector"><img src={images.default[activeImgSrcFirstSection]} className="device-img" alt="bg" /></div>
              <div className="device-bg-sector"><img src={images.default[activeImgSrcSecondSection]} className="device-img" alt="bg" /></div>
              <div className="device-bg-sector"><img src={images.default[activeImgSrcThirdSection]} className="device-img" alt="bg" /></div>
            </div>
            <div className="device-frame">
              <img src={device01} className="device" alt="bg" />
              <img src={device02} className="device" alt="bg" />
              <img src={device03} className="device" alt="bg" />
           </div>
         </div>
       );
      }
    return <div />;
   }
}

export default Demo;
