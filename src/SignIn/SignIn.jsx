import React from 'react';


class SignIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isMobile: false,
    }
  }

  componentDidMount() {
    const { isMobile } = this.state;
    if (!isMobile && window.innerWidth < 479) {
      this.setState({ isMobile: !isMobile });
    }
  }

  render() {
    const { isMobile } = this.state;
    if (isMobile) {
      return (
        <div className="sign_in" >
          <input autoCorrect="off" autoCapitalize="off" type="email" name="email" placeholder="Mobile number or email" className="sign_in-input sign_in-input--top"/>
          <input autoCorrect="off" type="password" name="password" placeholder="Password" className="sign_in-input sign_in-input--bottom"/>
          <button type="button" value="Log In" className="sign_in-input sign_in_btn" name="login"><span className="sign_in-input sign_in_btn-text">Log In</span></button>
          <div className="sign_up-opt">or <span className="sign_up-text">Create new account</span></div>
       </div>
     );
    }
    return <div />;
   }
}
export default SignIn;
