import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js'
import { Row, Col, FormGroup, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';


class FormulaListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingList: ""
    };

  }

  deleteThisFormula() {
    if (confirm('Delete the Formula?')) {
      Meteor.call('formulas.remove', this.props.formula._id)
    };
  }

  showDetails = (event, key) => {
    console.log("showing detail!!!")
    console.log(this.props.formula)
    console.log(this.state.ingList)
        
  }

    

  pushToList(list, item) {
    list.push(item)
  }

  donePushing(){
    // this.setState({
    //   ingList: list
    // })
  
  }



  render() {

    return (
      <li>
        <button className="delete" onClick={this.deleteThisFormula.bind(this)}>
          &times;
        Delete Formula
        </button>

        <p> <b>Formula Name:</b> {this.props.formula.name}</p>
        <p> <b>Description:</b> {this.props.formula.description}</p>
        <p> <b>Product Units:</b> {this.props.formula.productUnits}</p>
        
        <Link to={{
          pathname: '/editFormula/'+this.props.formula._id, 
          state: {
            formula: this.props.formula,
          }}}>
            <Button
            bsStyle="info"
          >
            View/Edit Formula
        </Button>
          </Link>
      </li>
    );
  }
}

export default FormulaListItem;