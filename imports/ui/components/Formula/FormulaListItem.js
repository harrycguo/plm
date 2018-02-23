import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class FormulaListItem extends Component {
    constructor(props) {
      super(props);
    }
 
    render() {

      return (     
        <div className="container">
      
        <Row>
            <Col><b>Formula Name:</b></Col>
        </Row>
          
        </div>
      );
    }
  }
  
  export default FormulaListItem;