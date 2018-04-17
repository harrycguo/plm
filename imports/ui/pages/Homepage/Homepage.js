import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../../api/Users/users.js'
import { Accounts } from 'meteor/accounts-base';

class Homepage extends Component {
  constructor(props) {
    super(props);

  }

  render() {

    let user = Meteor.user();

    //admin
    if (Roles.userIsInRole(user, ['admin'])) {
      return (
        <div className="container">
          <header>
            <h1>Admin Home Page</h1>
          </header>
          <li><Link to='/inventoryManagement'>Inventory Management</Link></li>
          <li><Link to='/formulaManagement'>Formula Management</Link></li>
          <li><Link to='/productionLineManagement'>Production Line Management</Link></li>
          <li><Link to='/dni'>Distributor Network Inventory </Link></li>
          <li><Link to='/vendorManagement'>Vendor Management</Link></li>
          <li><Link to='/userManagement'>User Management</Link></li>
          <li><Link to='/viewLog'>View Global Log</Link></li>
          <li><Link to='/reports'>View Reports</Link></li>
          <li><Link to='/logout'>Logout</Link></li>

        </div>
      )

    }

    //manager
    else if (Roles.userIsInRole(user, ['manager'])) {
      return (
        <div className="container">
          <header>
            <h1>Manager Homepage</h1>
          </header>
          <li><Link to='/inventoryManagement'>Inventory Management</Link></li>
          <li><Link to='/formulaManagement'>Formula Management</Link></li>
          <li><Link to='/productionLineManagement'>Production Line Management</Link></li>
          <li><Link to='/dni'>Distributor Network Inventory </Link></li>
          <li><Link to='/vendorManagement'>Vendor Management</Link></li>
          <li><Link to='/userManagement'>User Management</Link></li>
          <li><Link to='/viewLog'>View Global Log</Link></li>
          <li><Link to='/reports'>View Reports</Link></li>
          <li><Link to='/logout'>Logout</Link></li>
        </div>
      )

    }

    //user
    else {
      return (

        <div className="container">
          <header>
            <h1>User Homepage</h1>
          </header>

          <li><Link to='/inventoryManagement'>Inventory Management</Link></li>
          <li><Link to='/formulaManagement'>Formula Management</Link></li>
          <li><Link to='/productionLineManagement'>Production Line Management</Link></li>
          <li><Link to='/dni'>Distributor Network Inventory </Link></li>
          <li><Link to='/vendorManagement'>Vendor Management</Link></li>
          <li><Link to='/reports'>View Reports</Link></li>
          <li><Link to='/logout'>Logout</Link></li>
        </div>
      )

    }
  }
}

export default withTracker(() => {
  const subscription = Meteor.subscribe('users')
  return {
    loading1: subscription.ready(),
    users1s: Meteor.users.find({}).fetch()
  };
})(Homepage);