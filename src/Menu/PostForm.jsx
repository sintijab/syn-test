import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../functions.js';
import { getPostsAction, addPostAction } from '../actions/postActions.js';
import { getUserDetailsAction, editUserDetailsAction } from '../actions/profileActions.js';

class PostForm extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      cosmic: null,
      title: '',
      about: '',
      imgurl: '',
      period: '',
      plan: '',
      info: '',
      location: getCookie('location'),
      author: getCookie('sId'),
      userData: null,
      postAdded: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getPeriodOptions = this.getPeriodOptions.bind(this);

    this.selected_font = React.createRef();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
        [name]: value,
    });
  }

  componentDidUpdate() {
    const { profileData, postAddedAction, submit } = this.props;
    const { userData, postAdded } = this.state;

    if (profileData.type === 'GET_PROFILE' && userData !== profileData.profileDetails) {
      this.setState({
        userData: profileData.profileDetails,
      })
    } else if (profileData.type === 'PROFILE_UPDATED' && profileData.profileDetails && userData && userData !== profileData.profileDetails) {
      this.setState({
        userData: profileData.profileUpdateDetails,
      })
    }
    if (postAddedAction && postAddedAction.type === 'POST_ADDED' && !postAdded) {
      submit(true);
      this.setState({
        postAdded: true,
        title: '',
        about: '',
        imgurl: '',
        period: '',
        plan: '',
        info: '',
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { title, about, imgurl, period, plan, info, location, author, userData } = this.state;
    const formData = {
      title: title,
      about: about,
      imgurl: imgurl,
      period: period,
      plan: plan,
      info: info,
      location: location,
      author: author,
      userData: userData
    };
    this.props.addPostAction(formData);
  }

  toggleOverlay() {
    const { displayOverlay } = this.state;
    this.setState({ displayOverlay: !displayOverlay });
  }

  getPeriodOptions() {
    let periodOptions = [];
    for(let i = 1; i <=14; i++) {
      periodOptions.push(<option value={i} key={i}>{i}</option>);
    }
    return periodOptions;
  }


  render() {
    const { title = '', about, imgurl, period, plan, info, location = '' } = this.state;
    const { toggleOverlay } = this.props;
    const periodOptions = this.getPeriodOptions();

      return (
        <div className='post-form-overlay'>
        <span className='form-close' onClick={toggleOverlay}>Close</span>
        <form className='post_form' onSubmit={this.handleSubmit}>
          <div className="post_form-group">
            <label for="title" className="post_form-title">Create project event <br/>
              <span className="post_form-info">& involve more people to get know your business, plan or project</span>
            </label>
            <input id="title" type="text" name="title" className="post_form-control" placeholder="Title" value={title} onChange={this.handleChange}/>
            <textarea id="about" rows="30" type="text" name="about" className="post_form-control form-text-area" placeholder="About" value={about} onChange={this.handleChange}/>
            <textarea id="plan" rows="7" type="text" name="plan" className="post_form-control form-text-area" placeholder="Actions" value={plan} onChange={this.handleChange}/>
            <textarea id="info" rows="7" type="text" name="info" className="post_form-control form-text-area" placeholder="Additional information" value={info} onChange={this.handleChange}/>
            <div className="post_form-group-item">
              <label for="period">How many days event will be visible on feed (1-14) ?:</label>
              <select id="period" value={period} name="period" className="post_form-control post_form-input" onChange={this.handleChange}>{periodOptions}</select>
            </div>
            <div className="post_form-group-item">
              <label for="period">Post placeholder image link
                <span className="post_form-hint">(e.g. https://www.example.com/image.jpg):</span>
              </label>
              <input id="imgurl" value={imgurl} type="url" name="imgurl" className="post_form-control" placeholder="https://" onChange={this.handleChange}/><br/>
            </div>
            <div className="post_form-group-item">
              <label>Location where event will be visible: </label>
              <a href="#l">{location}</a>
              <span className="post_form-hint"> * by default will be your current location</span><br/>
            </div>
            <button className="btn btn-info post_form-control--submit">Submit</button>
          </div>
        </form>
        </div>
      );
    }
  }

const mapStateToProps = state => ({
  postsState: state.postsState.postsData,
  profileData: state.profileData,
  postAddedAction: state.postsState,
})

export default connect(mapStateToProps, { getPostsAction, getUserDetailsAction, editUserDetailsAction, addPostAction })(PostForm);
