import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Vendors } from '../../../api/Vendors/vendors.js'
import Vendor from '../../components/Vendor/Vendor.js'
import { Table } from 'react-bootstrap'
import VendorManagementNavBar from '../../components/VendorManagementNavBar/VendorManagementNavBar.js'
 
// App component - represents the whole app
class VendorManagement extends Component {
  constructor(props) {
    super(props);
    console.log("User = ")
    console.log(Meteor.user());

  }

  renderVendors() {
    return this.props.vendors.map((vendor) => (
      <Vendor key={vendor._id} vendor={vendor} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Vendor Management Page</h1>
        </header>
        
        <VendorManagementNavBar/>
        <p></p>

        <h2>List of Vendors</h2>
        <hr></hr>

        <ul>
          {this.renderVendors()}
        </ul>
        
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('vendors');
    return {
      vendors: Vendors.find({}).fetch(),
    };
  })(VendorManagement);