import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Row, Col, FormGroup, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';


class IntermediateListItem extends Component {
  constructor(props) {
    super(props);

  }

  deleteThisFormula() {
    if (confirm('Delete the Intermediate?')) {
      Meteor.call('intermediates.remove', this.props.intermediate._id,
      function(error, result) {
        if (error){
          Bert.alert(error.reason, 'danger')
        }
      })
    };
  }

  render() {
    let user = Meteor.user();
    let editButton = null;
    let deleteButton = null;

    if (Roles.userIsInRole(user, ['admin'])) {
      editButton = <Link to={{
        pathname: '/editIntermediate/'+this.props.intermediate._id, 
        state: {
            formula: this.props.intermediate,
        }}}>
          <Button
          bsStyle="info"
        >
          Edit Intermediate
      </Button>
        </Link>

      deleteButton = <button className="delete" onClick={this.deleteThisFormula.bind(this)}>
            &times;
          Delete Intermediate
          </button>
          
    } 
    
    else {
      editButton = <div className="containerNone"></div>;
      deleteButton = <div className="containerNone"></div>
    }

    return (
      <li>

        {deleteButton}
        
        <p> <b>Intermediate Name:</b> {this.props.intermediate.name}</p>
        <p> <b>Description:</b> {this.props.intermediate.description}</p>
        <p> <b>Product Units:</b> {this.props.intermediate.productUnits}</p>
      
        <div className="side-container-zero">

        <div className="container-button">
        <Link to={{
            pathname: '/viewIntermediate/'+this.props.intermediate._id, 
            state: {
                formula: this.props.intermediate,
            }}}>
              <Button
              
            >
              View Intermediate
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

export default IntermediateListItem;