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
      for (i = 1; i < Vendors.find().fetch().length + 1; i++) {
        items.push(<option key={i} value={vendorArr[i-1]._id}>{vendorArr[i-1].vendor}</option>);
      }
      return items;
  }
  render() {
    return (
        <select
         ref={vendor => (this.vendor = vendor)}
         name="vendor">
         <option key={0} value="null">(no vendor)</option>
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