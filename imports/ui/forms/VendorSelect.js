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
// 
var selected = undefined;
export class VendorSelect extends Component {
  constructor(props) {
    super(props);
  }

  renderOptions() {
      let items = [];
      var vendorArr = Vendors.find().fetch();
      for (i = 1; i < Vendors.find().fetch().length + 1; i++) {
        if(this.props.vendor && (vendorArr[i-1]._id == this.props.vendor._id || vendorArr[i-1]._id==this.props.vendor.vendor)) {
          items.push(<option selected="selected" key={i} value={vendorArr[i-1]._id}>{vendorArr[i-1].vendor}</option>);
        } else {
          items.push(<option key={i} value={vendorArr[i-1]._id}>{vendorArr[i-1].vendor}</option>);
        }
      }
      return items;
  }
  optionChanged(){
    selected=this
    return this
  }
  render() {
    return (
        <select
         ref={vendor => (this.vendor = vendor)}
         name="vendor"
         onChange={this.optionChanged.bind(this)}>
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