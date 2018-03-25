import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, Container, FormGroup, ControlLabel, Button } from 'react-bootstrap';


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

    let user = Meteor.user()

    if (Roles.userIsInRole(user, ['admin'])) {
      editButton = < Link to={{
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

      deleteButton = <button className="delete" onClick={this.deleteThisVendor.bind(this)}>
          &times;
        Delete Vendor</button>
          
  } 
    
    else {
      editButton = <div className="containerNone"></div>;
      deleteButton = <div className="containerNone"></div>
    }

    return (     
      <li>
        {deleteButton}

        <p> <b>Name:</b> {this.props.vendor.vendor}</p>
        <p> <b>Contact Info:</b> {this.props.vendor.contact}</p>
        <p> <b>Freight Code Carrier:</b> {this.props.vendor.FCC}</p>

        {editButton}
      </li>
    );
  }
}

export default Vendor;