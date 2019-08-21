import React from 'react';
import { getCookie, setCookie } from '../functions.js';
import { connect } from 'react-redux';
import { signInAction, getCurrentLocation } from '../actions/signActions.js';
import axios from 'axios';
const hashed = require('password-hash');

const Cosmic = require('cosmicjs')({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac3luNG55LmNvbSIsInBhc3N3b3JkIjoiMmU5YmE4MmQ5YTMwYjZkMzkxNDNhNDRiZDJiZmYyMTQiLCJpYXQiOjE1NjA1NTI4MzF9.12JEhTvZyDQA3pcQYpyLruKUMao1PRyrlPFPbhaUw3o'
})

class SignIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: !!(getCookie('val')),
      email: '',
      password: '',
      message: null,
      isMobile: false,
      signUpOverlay: false,
      signInOverlay: true,
      validationOverlay: false,
      uname: '',
      mail: '',
      upassword: '',
      authNrSent: false,
      validateNr: '',
      signUpSuccess: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displaySignUpOverlay = this.displaySignUpOverlay.bind(this);
    this.displaySignInOverlay = this.displaySignInOverlay.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.sendUDetails = this.sendUDetails.bind(this);
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

    const { email, password } = this.state;
    let adjustedEmail = email.replace("@", "");
    let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");
    const _this = this;
    axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/object/${emailEncoded}`)
    .then(function (response) {
      if (!response.data.object) {
        this.setState({
          error: true,
          loading: false
        })
      } else {
        let responseData = response.data.object.metadata.uid;
        const logInSuccess = hashed.verify(JSON.stringify(password), responseData);
        if (logInSuccess) {
          setCookie('sId', email, 1);
          _this.props.signInAction();
          getCurrentLocation();
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  sendUDetails(uname, mail, upassword) {
    var hId = hashed.generate(JSON.stringify(upassword));
    let adjustedEmail = mail.replace("@", "");
    let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");
    setCookie('sId', mail, 1);

    const params = {
      title: uname,
      type_slug: 'users',
      slug: emailEncoded,
      content: '',
      status: 'published',
      metafields: [
        {
          value: uname,
          key: 'uname',
          title: 'userName',
          type: 'text',
          children: null
        },
        {
          value: emailEncoded,
          key: 'email',
          title: 'userMail',
          type: 'text',
          children: null
        },
        {
          value: hId,
          key: 'uid',
          title: 'uid',
          type: 'text',
          children: null
        },
      ],
      options: {
        slug_field: false
      }
    }
    const Cosmic = require('cosmicjs')({
      token: getCookie('val') // optional
    })
    Cosmic.getBuckets()
    .then(data => {
      const bucket = Cosmic.bucket({
        slug: data.buckets[0].slug,
        write_key: ''
      })

    bucket.addObject(params)
    .then(data => {
      this.setState({
        uname: '',
        mail: '',
        password: '',
      });
    })
    .catch(err => {
      console.log(err)
    })
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleSignUp(event) {
    event.preventDefault();

    const { uname, mail } = this.state;
    const uValidation = Math.floor((Math.random() * 999000) + 100000);
    sessionStorage.setItem('authNr', uValidation);
    this.setState({ authNrSent: true, validationOverlay: true, signUpOverlay: false, signInOverlay: false });

      const mailjet = require ('node-mailjet')
      .connect('3a81fc2e9fd8aa4b0c7388a3b2216c93', '7ff28ce767dc928dcfb127b23b211725')
      const request = mailjet
      .post("send", {'version': 'v3.1'})
      .request({
        "Messages":[
          {
            "From": {
              "Email": "info@syn4ny.com",
              "Name": "Admin"
            },
            "To": [
              {
                "Email": `${mail}`,
                "Name": `${uname}`
              }
            ],
            "Subject": "Welcome to SYN4NY.",
            "TextPart": "",
            "HTMLPart": `<h3>Dear ${uname},</h3><br />Welcome to the <h3><a href='https://www.syn4ny.com/'>Syn4ny</a>!</h3><br />! Your registration code is ${uValidation}`,
            "CustomID": "GettingStarted"
          }
        ]
      })
      request
        .then((result) => {
          console.log(result.body)
        })
        .catch((err) => {
          console.log(err.statusCode)
        })
  }

  validateUser(event) {
    event.preventDefault();
    const { validateNr, uname, mail, upassword } = this.state;

    const storedNr = sessionStorage.getItem('authNr');
    if (JSON.stringify(validateNr) === JSON.stringify(storedNr)) {
      this.setState({ authNrSent: false, validationOverlay: false, signUpSuccess: true, signInOverlay: true });
      this.sendUDetails(uname, mail, upassword);
    } else {
      this.setState({ authNrSent: false, validationOverlay: false, signUpSuccess: false, signUpOverlay: true });
      const sId = sessionStorage.getItem('sId') ? JSON.stringify(sessionStorage.getItem('sId')) : false;
      if (sId) {
        Cosmic.getBuckets()
        .then(data => {
          const bucket = Cosmic.bucket({
            slug: data.buckets[0].slug,
            write_key: ''
          })
          bucket.deleteObject({
            slug: sId,
          })
          .then(data => {
            console.log(data)
          })
          .catch(err => {
            console.log(err)
          })
        });
      }
    }
  }

  displaySignUpOverlay() {
    this.setState({ signUpOverlay: true, signInOverlay: false, validationOverlay: false });
  }

  displaySignInOverlay() {
    this.setState({ signInOverlay: true, signUpOverlay: false, validationOverlay: false });
  }

  componentDidMount() {
    const { isMobile } = this.state;
    if (!isMobile && window.innerWidth < 479) {
      this.setState({ isMobile: !isMobile });
    }
  }

  render() {
    const { isMobile, loggedIn, email, password, signUpOverlay, signInOverlay, validationOverlay, uname, mail, upassword, validateNr, signUpSuccess } = this.state;
    const { signType } = this.props;

    const signUpError = signUpSuccess === false;
    const h1 = `Thank you, ${uname}!`;
    const h2 = `We have just sent to your email ${mail} vertification code,`;
    const h2_opt = `Please submit here:`;
    const validationForm = (
      <form onSubmit={this.validateUser} className="sign-up-form">
      <div className="sign_up-opt sign_up-opt-text">
        <span>{h1}</span><br />
        <span>{h2}</span><br />
        <span>{h2_opt}</span>
      </div>
      <input autoCorrect="off" autoCapitalize="off" type="number" name="validateNr" value={validateNr} onChange={this.handleChange} placeholder="" className="sign_in-input"/>
      <button type="submit" value="Log In" className="sign_in-input sign_in_btn sign_in_btn-text">Submit</button>
      <div className="sign_up-opt">or <span className="sign_up-text" onClick={this.displaySignInOverlay}>or Sign in</span></div>
    </form>
    )
    const registerForm = (
      <form onSubmit={this.handleSignUp} className="sign-up-form">
        <input autoCorrect="off" type="text" name="uname" value={uname} onChange={this.handleChange} placeholder="Name" className="sign_up-input"/>
        <input autoCorrect="off" autoCapitalize="off" type="email" name="mail" value={mail} onChange={this.handleChange} placeholder="Email address" className="sign_up-input"/>
        <input autoCorrect="off" type="password" name="upassword" value={upassword} onChange={this.handleChange} placeholder="Password" className="sign_up-input"/>
        <button type="submit" value="Sign up" className="sign_in-input sign_in_btn sign_in_btn-text">Sign up</button>
        <div className="sign_up-opt">or <span className="sign_up-text" onClick={this.displaySignInOverlay}>Sign in</span></div>
      </form>
    );
    if (isMobile && !loggedIn && signType !== 'LOGGED_IN') {
      return (
        <div className="sign_in" >
        {signUpError && signUpOverlay && <span>Registration has not completed, please try again</span>}
        {signUpOverlay && registerForm}
        {validationOverlay && validationForm}
        {signUpSuccess && <span className="sign_in-input sign-up-msg">Thank you! Registration has completed!</span>}
          {signInOverlay &&
            <form onSubmit={this.handleSubmit} className="sign-up-form">
            <input autoCorrect="off" autoCapitalize="off" type="email" name="email" value={email} onChange={this.handleChange} placeholder="Mobile number or email" className="sign_in-input"/>
            <input autoCorrect="off" type="password" name="password" value={password} onChange={this.handleChange} placeholder="Password" className="sign_in-input"/>
            <button type="submit" value="Log In" className="sign_in-input sign_in_btn sign_in_btn-text">Log In</button>
            <div className="sign_up-opt">or <span className="sign_up-text" onClick={this.displaySignUpOverlay}>Create new account</span></div>
          </form>}
       </div>
     );
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
