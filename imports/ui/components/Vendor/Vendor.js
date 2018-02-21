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
    if(confirm('Delete the Vendor?')) {
      Meteor.call('vendors.remove', this.props.vendor._id)
    };
  }

  render() {
    return (     
      <li>
        <button className="delete" onClick={this.deleteThisVendor.bind(this)}>
          &times;
        Delete Vendor</button>

        <p> <b>Name:</b> {this.props.vendor.vendor}</p>
        <p> <b>Contact Info:</b> {this.props.vendor.contact}</p>
        <p> <b>Freight Code Carrier:</b> {this.props.vendor.FCC}</p>

        <Link to={{
          pathname: '/editVendor/'+this.props.vendor._id, 
          state: {
            name: this.props.vendor.vendor,
            contact: this.props.vendor.contact,
            FCC: this.props.vendor.FCC}
          }}>
            <Button
            bsStyle="info"
          >
            Edit Vendor
        </Button>
          </Link>
      </li>
    );
  }
}

export default Vendor;