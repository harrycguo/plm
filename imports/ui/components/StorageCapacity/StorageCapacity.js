import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class StorageCapacity extends Component {
    constructor(props) {
      super(props);
    }
 
    render() {

    let user = Meteor.user();
    let button = null;

    if (Roles.userIsInRole(user, ['admin'])) {
      button = <Col><Link to={{
        pathname: '/editCapacity/'+this.props.sc._id, 
        state: {
          name: this.props.sc.name,
          capacity: this.props.sc.capacity,
          }
        }}>
          <Button bsStyle="info" bsSize="xsmall">
          Edit Capacity
          </Button>
        </Link></Col>;
    } else {
      button = <Col></Col>;
    }


      return (     
        <div className="container-keepLeftBigRight">
      
        <Row>
            <Col><b>Location:</b> {this.props.sc.name}</Col>
            <Col><b>Total Capacity:</b> {this.props.sc.capacity} Sq. Ft.</Col>
            <Col><b>Capacity Used:</b> {this.props.sc.used} Sq. Ft.</Col>
            <Col><b>Capacity Remaining:</b> {Number(this.props.sc.capacity-this.props.sc.used)} Sq. Ft.</Col>
        </Row>
          
        </div>
      );
    }
  }
  
  export default StorageCapacity;