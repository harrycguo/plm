import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

// Task component - represents a single todo item
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
          type: this.props.sc.type,
          capacity: this.props.sc.capacity,
          }
        }}>
          <Button>
          Edit Capacity
          </Button>
        </Link></Col>;
    } else {
      button = <Col></Col>;
    }


      return (     
        <div className="container">
      
        <Row>
            <Col><b>Location:</b> {this.props.sc.type}</Col>
            <Col><b>Total Capacity:</b> {this.props.sc.capacity} lbs</Col>
            <Col><b>Capacity Used:</b> {this.props.sc.used} </Col>
            {button}


            
        </Row>
          
        </div>
      );
    }
  }
  
  export default StorageCapacity;