import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import StorageCapacity from '../../components/StorageCapacity/StorageCapacity.js'
import { withTracker } from 'meteor/react-meteor-data';
import { Row, Col, Container, FormGroup, ControlLabel, Button } from 'react-bootstrap';

// Task component - represents a single todo item
class StorageCapacityWrapper extends Component {
    constructor(props) {
      super(props);
    }

    renderCapacities() {
        return this.props.sc.map((sc) => (
          <StorageCapacity key={sc._id} sc={sc} />
        ));
      }
  
    render() {
      
      let user = Meteor.user();
      let editButton = null;
        
      if (Roles.userIsInRole(user, ['admin'])) {
        editButton = <Link to={{
          pathname: '/editCapacities', 
          state: {
            capacities: this.props.sc,
            hist: this.props.hist
          }}}>
            <Button
            bsStyle="info" 
          >
            Edit Capacities
        </Button>
          </Link>
            
      } 
      
      else {
        editButton = <div className="containerNone"></div>;
      }

      return (   
        <div>  
        <div className="side-container">
            {this.renderCapacities()}
            
        </div>
          {editButton}
          <p></p>
        </div>

      );
    }
  }
  
  export default withTracker(() => {
    const subscription = Meteor.subscribe('storageCapacities');
      return {
        sc: StorageCapacities.find({}).fetch(),
      };
    })(StorageCapacityWrapper);