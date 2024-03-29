import React from 'react';
import { getCookie, setCookie } from '../functions.js';
import { connect } from 'react-redux';
import { signInAction } from '../actions/signActions.js';
const hashed = require('password-hash');
let Cosmic = require('cosmicjs')()
Cosmic.authenticate({
  email: 'info@syn4ny.com',
  password: 'ContributeAccessTest',
}).then(data => {
  Cosmic = require('cosmicjs')({
    token: data.token
  })
})
.catch(err => {
  console.error(err)
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
      signInSuccess: null,
      uValidation: '',
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
            [name]: value,
            signUpSuccess: null,
            signInSuccess: null
        });
    }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;
    if (Object.keys(email).length && Object.keys(password).length) {
      this.props.signInAction(email, password);
    } else {
      this.setState({
        signInSuccess: false,
        email: '',
        password: '',
      })
    }
  }

  sendUDetails(uname, mail, upassword) {
    var hId = hashed.generate(JSON.stringify(upassword));
    let adjustedEmail = mail.replace("@", "").replace(/_/g, '-');
    let emailEncoded = encodeURIComponent(adjustedEmail).replace(/\./g, "");

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
          value: mail,
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
        {
          value: '5d45c54b82503a56f1d980bc',
          key: 'storedPostIds',
          title: 'storedPostIds',
          type: 'text',
          children: null
        },
      ],
      options: {
        slug_field: false
      }
    }
    Cosmic.getBuckets()
    .then(data => {
      const bucket = Cosmic.bucket({
        slug: data.buckets[0].slug,
        write_key: data.buckets[0].api_access.write_key
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
    const uValidation = Math.floor((Math.random() * 999000) + 100000);
    sessionStorage.setItem('authNr', uValidation);
    this.setState({ authNrSent: true, validationOverlay: true, signUpOverlay: false, signInOverlay: false, uValidation: uValidation });

      // const mailjet = require ('node-mailjet')
      // .connect('3a81fc2e9fd8aa4b0c7388a3b2216c93', '7ff28ce767dc928dcfb127b23b211725')
      // const request = mailjet
      // .post("send", {'version': 'v3.1'})
      // .request({
      //   "Messages":[
      //     {
      //       "From": {
      //         "Email": "info@syn4ny.com",
      //         "Name": "Admin"
      //       },
      //       "To": [
      //         {
      //           "Email": `${mail}`,
      //           "Name": `${uname}`
      //         }
      //       ],
      //       "Subject": "Welcome to SYN4NY.",
      //       "TextPart": "",
      //       "HTMLPart": `<h3>Dear ${uname},</h3><br />Welcome to the <h3><a href='https://www.syn4ny.com/'>Syn4ny</a>!</h3><br />! Your registration code is ${uValidation}`,
      //       "CustomID": "GettingStarted"
      //     }
      //   ]
      // })
      // request
      //   .then((result) => {
      //     console.log(result.body)
      //   })
      //   .catch((err) => {
      //     console.log(err.statusCode)
      //   })
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

  componentDidUpdate() {
    const { loggedIn, isMobile } = this.state;
    const { signType } = this.props;
    if (signType.type === 'LOGGED_IN' && isMobile && !loggedIn) {
      this.setState({ loggedIn: true, signInSuccess: true });
    }
  }

  componentDidMount() {
    const { isMobile } = this.state;
    if (!isMobile && window.innerWidth < 479) {
      this.setState({ isMobile: !isMobile });
    }
  }

  render() {
    const { isMobile, loggedIn, email, password, signUpOverlay, signInOverlay, validationOverlay, uname, mail, upassword, validateNr, signUpSuccess, signInSuccess, uValidation } = this.state;
    const { signType } = this.props;

    const signUpError = signUpSuccess === false;
    const h1 = `Thank you, ${uname}!`;
    const h2 = `We have just generated verification code- ${uValidation}`;
    const h2_opt = `Please submit here:`;
    const validationForm = (
      <form onSubmit={this.validateUser} className="sign-up-form">
      <div className="sign_up-opt sign_up-opt-text">
        <span>{h1}</span><br />
        <span>{h2}</span><br />
        <span>{h2_opt}</span>
      </div>
      <input autoCorrect="off" autoCapitalize="off" type="number" name="validateNr" value={validateNr} onChange={this.handleChange} placeholder="" className="sign_in-input"/>
      <button type="submit" className="sign_in-input sign_in_btn sign_in_btn-text">Submit</button>
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
    if (isMobile && !loggedIn && signType.type !== 'LOGGED_IN' && (window.location.pathname === "" || window.location.pathname === "/")) {
      return (
        <div className="sign_in" >
        {signUpError && signUpOverlay && <span>Registration has not completed, please try again</span>}
        {signUpOverlay && registerForm}
        {validationOverlay && validationForm}
        {signUpSuccess && <span className="sign_in-input sign-up-msg">Thank you! Registration has completed!</span>}
        {signInSuccess === false && <span className="sign_in-input sign-up-msg">Log In failed, please try again!</span>}
          {signInOverlay &&
            <form onSubmit={this.handleSubmit} className="sign-up-form">
            <input autoCorrect="off" autoCapitalize="off" type="email" name="email" value={email} onChange={this.handleChange} placeholder="Email address" className="sign_in-input"/>
            <input autoCorrect="off" type="password" name="password" value={password} onChange={this.handleChange} placeholder="Password" className="sign_in-input"/>
            <button type="submit" className="sign_in-input sign_in_btn sign_in_btn-text">Log In</button>
            <div className="sign_up-opt">or <span className="sign_up-text" onClick={this.displaySignUpOverlay}>Create new account</span></div>
          </form>}
       </div>
     );
   } else if (isMobile && !loggedIn && signType.type !== 'LOGGED_IN' && window.location.pathname !== "" && window.location.pathname !== "/") {
     return (
       <div className="sign_in-preview" >
         {signInOverlay &&
           <div className="sign-up-form-preview">
           <button className="sign_in-input sign_in_btn sign_in_btn-text" onClick={() => window.location.replace(window.location.origin)}>Log In</button>
           <div className="sign_up-opt">or <span className="sign_up-text" onClick={() => window.location.replace(window.location.origin)}>Create new account</span></div>
         </div>}
      </div>
    );
   }
    return <div />;
   }
}
const mapStateToProps = state => ({
  error: state.error,
  signType: state.signInStatus,
  uData: state.signInStatus.uData
})

export default connect(mapStateToProps, { signInAction })(SignIn);
