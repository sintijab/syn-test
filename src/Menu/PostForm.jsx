import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../functions.js';
import { getPostsAction } from '../actions/postActions.js';
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
      city: getCookie('city'),
      author: getCookie('sId'),
      userData: null,
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
    const { profileData } = this.props;
    const { userData } = this.state;

    if (profileData.type === 'GET_PROFILE' && userData !== profileData.profileDetails) {
      this.setState({
        userData: profileData.profileDetails,
      })
    } else if (profileData.type === 'PROFILE_UPDATED' && userData !== profileData.profileDetails) {
      this.setState({
        userData: profileData.profileUpdateDetails,
      })
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { title, about, imgurl, period, plan, info, city, author, userData } = this.state;
    const { submit } = this.props;
    const _this = this;

    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    const postId = `${title}${author}${date}`;

    const params = {
      title: title,
      type_slug: 'tests',
      content: '',
      status: 'published',
      metafields: [
        {
          value: about,
          key: 'about',
          title: 'About',
          type: 'textarea',
          children: null
        },
        {
          value: imgurl,
          key: 'img',
          title: 'Image link',
          type: 'text',
          children: null
        },
        {
          value: period,
          key: 'period',
          title: 'Display period',
          type: 'text',
          children: null
        },
        {
          value: plan,
          key: 'actions',
          title: 'Actions',
          type: 'textarea',
          children: null
        },
        {
          value: info,
          key: 'info',
          title: 'Additional info',
          type: 'textarea',
          children: null
        },
        {
          value: city,
          key: 'city',
          title: 'City (range)',
          type: 'text',
          children: null
        },
        {
          value: author,
          key: 'author',
          title: 'Author',
          type: 'text',
          children: null
        },
        {
          value: date,
          key: 'date',
          title: 'Added',
          type: 'text',
          children: null
        },
        {
          value: postId,
          key: 'postId',
          title: 'postId',
          type: 'text',
          children: null
        },
      ],
      options: {
        slug_field: false
      }
    }
    if(!!getCookie('val')) {
    const Cosmic = require('cosmicjs')({
      token: getCookie('val') // optional
    })
    Cosmic.getBuckets()
    .then(data => {
      const bucket = Cosmic.bucket({
        slug: data.buckets[0].slug,
        write_key: data.buckets[0].api_access.write_key,
      })

    bucket.addObject(params)
    .then(data => {
      this.setState({
        title: '',
        about: '',
        imgurl: '',
        period: '',
        plan: '',
        info: '',
      });
      submit(true)
      _this.props.editUserDetailsAction(userData, postId, true, 'submit');
    })
    .catch(err => {
      console.log(err)
    })
    })
    .catch(err => {
      console.log(err)
    })
    }
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
    const { title = '', about, imgurl, period, plan, info, city = '' } = this.state;
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
              <label>Location: </label>
              <a href="#popup">{city}</a>
              <span className="post_form-hint"> * upgrade Membership plan to display globally</span><br/>
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
})

export default connect(mapStateToProps, { getPostsAction, getUserDetailsAction, editUserDetailsAction })(PostForm);
