import React from 'react';
import { getCookie } from '../functions.js';
import { connect } from 'react-redux';
import { signInAction } from '../actions/signActions.js';

const Cosmic = require('cosmicjs')();

class SignIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      email: '',
      password: '',
      message: null,
      isMobile: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
        this.setState({
            [name]: value
        });
    }

  handleSubmit(event) {
    event.preventDefault();
    debugger;

    const { email, password } = this.state;
    Cosmic.authenticate({
      email: email,
      password: password,
    }).then(data => {
      this.setState({
        loggedIn: true,
        password: '',
        email: '',
      })
      this.props.signInAction(data, email);
    })
    .catch(err => {
      console.log(err)
      this.setState({
        loggedIn: false,
        message: err.message,
      })
    })
  }

  componentDidMount() {
    const { isMobile } = this.state;
    if (!isMobile && window.innerWidth < 479) {
      this.setState({ isMobile: !isMobile });
    }
  }

  render() {
    const { isMobile, loggedIn, email, password } = this.state;
    if (isMobile && !loggedIn) {
      return (
        <div className="sign_in" >
          <form onSubmit={this.handleSubmit}>
            <input autoCorrect="off" autoCapitalize="off" type="email" name="email" value={email} onChange={this.handleChange} placeholder="Mobile number or email" className="sign_in-input sign_in-input--top"/>
            <input autoCorrect="off" type="password" name="password" value={password} onChange={this.handleChange} placeholder="Password" className="sign_in-input sign_in-input--bottom"/>
            <button type="submit" value="Log In" className="sign_in-input sign_in_btn sign_in_btn-text">Log In</button>
            <div className="sign_up-opt">or <span className="sign_up-text">Create new account</span></div>
          </form>
       </div>
     );
    }

    if (isMobile && loggedIn) {
      return <div>Welcome</div>
    }
    return <div />;
   }
}
const mapStateToProps = state => ({
  error: state.error,
  signType: state.signInStatus.type,
  userData: state.signInStatus.uData,
})

export default connect(mapStateToProps, { signInAction })(SignIn);
