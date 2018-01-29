import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
 
// App component - represents the whole app
class SuccessCreateUser extends Component {
  constructor(props) {
    super(props);
    
    console.log("User = ")
    console.log(Meteor.user());
    
  }
 
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Admin: Successfully created user! </h1>
        </header>

        <li><Link to='/createUser'>Create Another New User</Link></li>

        <li><Link to='/logout'>Logout</Link></li>
      </div>
    );
  }
}

export default SuccessCreateUser;