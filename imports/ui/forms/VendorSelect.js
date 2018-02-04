import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'
import { Vendors } from '../../api/Vendors/vendors.js';
import { createContainer } from 'meteor/react-meteor-data'

      // <select id = "selVendor" ref="vendors">
      //         { this.renderOptions() }
      // </select>

// Vendor select component
export class VendorSelect extends Component {
  constructor(props) {
    super(props);
  }

  renderOptions() {
      let items = [];
      var vendorArr = Vendors.find().fetch();
      console.log(vendorArr)
      // console.log(this.props)
      for (i = 0; i < Vendors.find().fetch().length; i++) {
        items.push(<option key={i} value={vendorArr[i]._id}>{vendorArr[i].vendor}</option>);
      }
      return items;
  }
  render() {
    return (
        <select
         ref={vendor => (this.vendor = vendor)}
         name="vendor">
         {this.renderOptions()}
        </select>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('vendors');
  return {
      vendors: Vendors.find({}).fetch()
  };
})(VendorSelect);