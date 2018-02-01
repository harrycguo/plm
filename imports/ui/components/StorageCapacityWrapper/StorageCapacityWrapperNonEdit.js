import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import StorageCapacityNonEdit from '../../components/StorageCapacity/StorageCapacityNonEdit.js'
import { withTracker } from 'meteor/react-meteor-data';
import { Row, Col, Container, FormGroup, ControlLabel, Button } from 'react-bootstrap';

// Task component - represents a single todo item
class StorageCapacityWrapperNonEdit extends Component {
    constructor(props) {
      super(props);
    }

    renderCapacities() {
        return this.props.sc.map((sc) => (
          <StorageCapacityNonEdit key={sc._id} sc={sc} />
        ));
      }
  
    render() {
      return (     
        <div className="side-container">
            {this.renderCapacities()}
        </div>
      );
    }
  }
  
  export default withTracker(() => {
    const subscription = Meteor.subscribe('capacities');
      return {
        sc: StorageCapacities.find({}).fetch(),
      };
    })(StorageCapacityWrapperNonEdit);