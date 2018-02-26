import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
 
// App component - represents the whole app
class UserHomepage extends Component {
  constructor(props) {
    super(props);
    console.log("User = ")
    console.log(Meteor.user());
    
  }
 
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>User Homepage</h1>
        </header>

        <li><Link to='/inventoryManagement'>Inventory Management</Link></li>
        <li><Link to='/formulaManagement'>Formula Management</Link></li>
        <li><Link to='/vendorManagement'>Vendor Management</Link></li>
        <li><Link to='/viewLog'>View Global Log</Link></li>
        <li><Link to='/logout'>Logout</Link></li>
      </div>
    );
  }
}

export default UserHomepage;