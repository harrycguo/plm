import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'
import { Vendors } from '../../api/Vendors/vendors.js';
import { createContainer } from 'meteor/react-meteor-data'

// Vendor select component
export class VendorSelect extends Component {
  constructor(props) {
    super(props);
  }

  getVendorId() {
    return ReactDOM.findDOMNode(this.refs.vendorSel.refs.vendors).value.trim();
  }

  renderOptions() {
      let items = [];
      for (i = 0; i < this.props.vendors.length; i++) {
        items.push(<option key={i} value={this.props.vendors[i]._id}>{this.props.vendors[i].vendor}</option>);
      }
      return items;
  }
  render() {
    return (
      <select id = "selVendor" ref="vendors">
              { this.renderOptions() }
      </select>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('vendors');
  return {
      vendors: Vendors.find({}).fetch(),
  };
})(VendorSelect);