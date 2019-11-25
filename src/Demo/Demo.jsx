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
    if (activeImgSrcThirdSection < 116 && imgVisibility) {
      this.getDemoSrc();
    } else if (imgVisibility) {
      this.setState({ activeImgSrcFirstSection: 0, activeImgSrcSecondSection: 1, activeImgSrcThirdSection: 2  });
    }
    if (!imgVisibility) {
    setTimeout(() => {
      this.setState({
        imgVisibility: true,
      })}, 1000);
    }
  }

  getDemoSrc() {
    const { activeImgSrcFirstSection, activeImgSrcSecondSection, activeImgSrcThirdSection } = this.state;
    const _this = this;
      setTimeout(() => {
        _this.setState({
          activeImgSrcFirstSection: activeImgSrcFirstSection + 3,
          activeImgSrcSecondSection: activeImgSrcSecondSection + 3,
          activeImgSrcThirdSection: activeImgSrcThirdSection + 3,
          imgVisibility: false
        });
      }, 4000);
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
              <div className="device-bg-sector" style={{left: "18vW"}} ><img src={images.default[activeImgSrcFirstSection]} className={deviceImgClassName}alt="bg" /></div>
              <div className="device-bg-sector" style={{left: "32vW", zIndex: 100 }}><img src={images.default[activeImgSrcSecondSection]} className={deviceImgClassName} alt="bg" /></div>
              <div className="device-bg-sector" style={{left: "46vW"}}><img src={images.default[activeImgSrcThirdSection]} className={deviceImgClassName} alt="bg" /></div>
            <div className="device-frame">
              <img src={device01} className="device" style={{left: "18vW"}} alt="bg" />
              <img src={device02} className="device" style={{left: "32vW", zIndex: 1000 }} alt="bg" />
              <img src={device03} className="device" style={{left: "46vW"}} alt="bg" />
           </div>
           <div className="device-bg-text"><span className="device-bg-intro"><b style={{fontSize: "1.87rem"}}>syn4ny.com</b> for your mobile device: </span><ul><li>explore and join project events</li><li>iniciate new ideas and plans</li><li>get new connections</li></ul></div>
          </div>
         </div>
       );
      }
    return <div />;
   }
}

export default Demo;
