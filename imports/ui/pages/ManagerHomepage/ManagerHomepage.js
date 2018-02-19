import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
 
// App component - represents the whole app
class ManagerHomepage extends Component {
  constructor(props) {
    super(props);
    console.log("User = ")
    console.log(Meteor.user());
    
  }
 
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Manager Homepage</h1>
        </header>

        <li><Link to='/managerViewInventory'>View Inventory</Link></li>
        <li><Link to='/logout'>Logout</Link></li>
      </div>
    );
  }
}

export default ManagerHomepage;