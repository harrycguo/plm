import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';

class EditProductionLine extends Component {
  constructor(props) {
    super(props);
}

  render() {

    let user = Meteor.user()
      return (
        <div className="container">
          <header>
            <h1>Welcome to Production Lifecycle Management Tool!</h1>
          </header>
          <ul>
            <li><Link to='/login'>Login</Link></li>
          </ul>
        </div>
      )
  }
}

export default EditProductionLine





