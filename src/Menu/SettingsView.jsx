import React from 'react';
import { connect } from 'react-redux';
import { logOutAction } from '../actions/signActions.js';

class SettingsView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: null,
    }
  }


  render() {
    const { data, mail } = this.props;
    const { object } = data || {};
    const { metadata } = object || {};
    const { uname } = metadata || '';
        return (
          <div className='preview preview_post detailed_post'>
            <div className="preview_post-date font-bold" onClick={this.props.logOutAction}>Log out</div>
            <h4 className="preview_post-title">{`${mail}`}</h4>
            <div className="disabled-text">
              <span className="active-post-header-text active-post-header-text-title">Edit password:</span>
              <span className="preview_post-text"><a href="#" role="button">Send email</a></span>
              <span className="active-post-header-text active-post-header-text-title">Edit username:</span>
              <span className="preview_post-text"><a href="#" role="button">{uname}</a></span>
          </div>
          </div>
       );
   }
}

const mapStateToProps = state => ({
  signType: state.signInStatus.type,
})

export default connect(mapStateToProps, { logOutAction })(SettingsView);
