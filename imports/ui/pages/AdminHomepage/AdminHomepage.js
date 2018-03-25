import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
 
class AdminHomepage extends Component {
  constructor(props) {
    super(props);
    console.log("User = ")
    console.log(Meteor.user());
  }
 
  render() {

    console.log(Meteor.user());

    return (

      <div className="container">
        <header>
          <h1>Admin Homepage</h1>
        </header>
        <li><Link to='/inventoryManagement'>Inventory Management</Link></li>
        <li><Link to='/formulaManagement'>Formula Management</Link></li>
        <li><Link to='/vendorManagement'>Vendor Management</Link></li>
        <li><Link to='/userManagement'>User Management</Link></li>
        <li><Link to='/viewLog'>View Global Log</Link></li>
        <li><Link to='/logout'>Logout</Link></li>

      </div>
    );
  }
}

export default AdminHomepage;