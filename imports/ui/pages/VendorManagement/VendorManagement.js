import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Vendors } from '../../../api/Vendors/vendors.js'
import Vendor from '../../components/Vendor/Vendor.js'
import { Table } from 'react-bootstrap'
import VendorManagementNavBar from '../../components/VendorManagementNavBar/VendorManagementNavBar.js'
 
class VendorManagement extends Component {
  constructor(props) {
    super(props);
  }

  renderVendors() {
    return this.props.vendors.map((vendor) => (
      <Vendor key={vendor._id} vendor={vendor} />
    ));
  }
 
  render() {
    return (
      <div>
        <h2>List of Vendors</h2>
        <hr className="divider"></hr>

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