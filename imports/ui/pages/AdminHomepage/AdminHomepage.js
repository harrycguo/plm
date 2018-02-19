import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
 
// App component - represents the whole app
class AdminHomepage extends Component {
  constructor(props) {
    super(props);
    
    console.log("User = ")
    console.log(Meteor.user());
    
  }
 
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Admin Home Page</h1>
        </header>
        <li><Link to='/adminViewInventory'>Inventory Management</Link></li>
        <li><Link to='/formulaManagement'>Formula Management</Link></li>
        <li><Link to='/userManagement'>User Management</Link></li>
        <li><Link to='/vendorManagement'>Vendor Management</Link></li>
        <li><Link to='/logout'>Logout</Link></li>

      </div>
    );
  }
}

export default AdminHomepage;