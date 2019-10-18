import React from 'react';
import device01 from '../img/device01.png';
import device02 from '../img/device02.png';
import device03 from '../img/device03.png';
import * as gallery from './indexImg.js';

class Demo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isMobile: !!(window.innerWidth < 479),
      activeImgSrcFirstSection: 0,
      activeImgSrcSecondSection: 1,
      activeImgSrcThirdSection: 2,
      imgVisibility: true,
    }
    this.getDemoSrc = this.getDemoSrc.bind(this);
  }

  componentDidUpdate() {
    const { activeImgSrcThirdSection, imgVisibility } = this.state;
    if (activeImgSrcThirdSection < 116 && !imgVisibility) {
      this.getDemoSrc();
    } else if (!imgVisibility) {
      this.setState({ activeImgSrcFirstSection: 0, activeImgSrcSecondSection: 1, activeImgSrcThirdSection: 2  });
    }
  }

  getDemoSrc() {
    const { activeImgSrcFirstSection, activeImgSrcSecondSection, activeImgSrcThirdSection, imgVisibility } = this.state;
    const _this = this;
      setTimeout(() => {
        _this.setState({
          activeImgSrcFirstSection: activeImgSrcFirstSection + 3,
          activeImgSrcSecondSection: activeImgSrcSecondSection + 3,
          activeImgSrcThirdSection: activeImgSrcThirdSection + 3,
          imgVisibility: false
        })}, 5000);
        if (!imgVisibility) {
          setTimeout(() => {
            _this.setState({
              imgVisibility: true,
            })}, 10);
        }
  }

  componentDidMount() {
    this.getDemoSrc();
  }

  render() {
    const { isMobile, activeImgSrcFirstSection, activeImgSrcSecondSection, activeImgSrcThirdSection, imgVisibility } = this.state;
    let images = gallery;
    const deviceImgClassName = imgVisibility ? 'device-img device-img-active' : 'device-img';

      if (!isMobile) {
        return (
          <div>
            <div className="device-bg">
              <div className="device-bg-sector"><img src={images.default[activeImgSrcFirstSection]} className={deviceImgClassName} alt="bg" /></div>
              <div className="device-bg-sector"><img src={images.default[activeImgSrcSecondSection]} className={deviceImgClassName} alt="bg" /></div>
              <div className="device-bg-sector"><img src={images.default[activeImgSrcThirdSection]} className={deviceImgClassName} alt="bg" /></div>
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
