import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'

 
// Task component - represents a single todo item
class Vendor extends Component {
  constructor(props) {
    super(props);
    this.deleteThisVendor = this.deleteThisVendor.bind(this);
  }

  deleteThisVendor() {
    Meteor.call('vendors.remove', this.props.vendor._id);
  }

  render() {
    return (     
      <li>
        <button className="delete" onClick={this.deleteThisVendor.bind(this)}>
          &times;
        Delete Vendor</button>

        <p> Name: {this.props.vendor.vendor}</p>
        <p> Contact: {this.props.vendor.contact}</p>
        <p> Freight Code Carrier: {this.props.vendor.FCC}</p>

        <Link to={{
          pathname: '/editVendor/'+this.props.vendor._id, 
          state: {
            name: this.props.vendor.vendor,
            contact: this.props.vendor.contact,
            FCC: this.props.vendor.FCC}
          }}>
            <button>
            Edit Vendor
            </button>
          </Link>
      </li>
      
    );
  }
}

export default Vendor;