import React from 'react';
import { getCookie } from '../functions.js';
const Cosmic = require('cosmicjs')();

class PostForm extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      cosmic: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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

  handleSubmit(event) {
    event.preventDefault();

    const { title } = this.state;
    const { submit } = this.props;
    const params = {
      title: title,
      type_slug: 'posts',
      content: '',
      status: 'draft',
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
        write_key: ''
      })

    bucket.addObject(params)
    .then(data => {
      this.setState({
        title: '',
        article: '',
        imgurl: '',
        font: '',
        font_size: '',
        categories: ''
      });
      submit(true)
    })
    .catch(err => {
      console.log(err)
    })
    })
    .catch(err => {
      console.log(err)
    })

    } else {
      console.log('please contact us in order to publish posts')
    }
  }

  toggleOverlay() {
    const { displayOverlay } = this.state;
    this.setState({ displayOverlay: !displayOverlay });
  }


  render() {
    const { title = '', article, imgurl, categories } = this.state;
    const { toggleOverlay } = this.props;

      return (
        <div className='post-form-overlay'>
        <span className='form-close' onClick={toggleOverlay}>Close</span>
        <form className='post_form' onSubmit={this.handleSubmit}>
          <div className="post_form-group">
            <input id="title" type="text" name="title" className="post_form-control" placeholder="Project Name" value={title} onChange={this.handleChange}/>
            <textarea id="article" rows="30" type="text" name="article" className="post_form-control form-text-area" placeholder="Description" value={article} onChange={this.handleChange}/>
            <input id="imgurl" value={imgurl} type="url" name="imgurl" className="post_form-control" placeholder="ImgLink" onChange={this.handleChange}/><br/>
            <input id="categories" required type="text" name="categories" className="post_form-control" placeholder="categories" value={categories} onChange={this.handleChange}/>
            <button className="btn btn-info post_form-control--submit">Submit</button>
          </div>
        </form>
        </div>
      );
    }
  }

export default PostForm;
