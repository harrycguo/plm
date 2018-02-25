import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import { Row, Col, FormGroup, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';


class FormulaListItem extends Component {
  constructor(props) {
    super(props);

  }

  deleteThisFormula() {
    if (confirm('Delete the Formula?')) {
      Meteor.call('formulas.remove', this.props.formula._id)
    };
  }

  render() {
    let user = Meteor.user();
    let editButton = null;
    let deleteButton = null;

    if (Roles.userIsInRole(user, ['admin'])) {
      editButton = <Link to={{
        pathname: '/editFormula/'+this.props.formula._id, 
        state: {
          formula: this.props.formula,
        }}}>
          <Button
          bsStyle="info"
        >
          Edit Formula
      </Button>
        </Link>

      deleteButton = <button className="delete" onClick={this.deleteThisFormula.bind(this)}>
            &times;
          Delete Formula
          </button>
          
    } 
    
    else {
      editButton = <div className="containerNone"></div>;
      deleteButton = <div className="containerNone"></div>
    }

    return (
      <li>
        
        <p> <b>Formula Name:</b> {this.props.formula.name}</p>
        <p> <b>Description:</b> {this.props.formula.description}</p>
        <p> <b>Product Units:</b> {this.props.formula.productUnits}</p>
        
        <div className="side-container-zero">

        <div className="container-button">
        <Link to={{
            pathname: '/viewFormula/'+this.props.formula._id, 
            state: {
              formula: this.props.formula,
            }}}>
              <Button
              
            >
              View Formula
          </Button>
            </Link>
            </div>

          
            <div className="container-button">
          {editButton}
            </div>

          </div>
      </li>
    );
  }
}

export default FormulaListItem;