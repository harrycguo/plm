import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, Container, FormGroup, ControlLabel, Button } from 'react-bootstrap';


class ProductionLineItem extends Component {
  constructor(props) {
    super(props);
    this.deleteThisProductionLine = this.deleteThisProductionLine.bind(this);
  }

  deleteThisProductionLine() {
    if(confirm('Delete the Production Line?')) {
      Meteor.call('productionLines.delete', this.props.productionLine._id)
    };
  }

  render() {

    let user = Meteor.user()

    if (Roles.userIsInRole(user, ['admin'])) {
      editButton = < Link to={{
        pathname: '/editProductionLine/'+this.props.productionLine._id, 
        state: {
          productionLine: this.props.productionLine
        }}}>
          <Button
          bsStyle="info"
        >
          Edit Production Line
      </Button>
        </Link>

      deleteButton = <button className="delete" onClick={this.deleteThisProductionLine.bind(this)}>
          &times;
        Delete Production Line</button>
          
    } 
    
    else {
      editButton = <div className="containerNone"></div>;
      deleteButton = <div className="containerNone"></div>
    }

    return (     
      <li>
        {deleteButton}

        <p> <b>Name:</b> {this.props.productionLine.name}</p>
        <p> <b>Description:</b> {this.props.productionLine.description}</p>
        <div className="side-container-zero">

        <div className="container-button">
        <Link to={{
            pathname: '/viewProductionLine/'+this.props.productionLine._id, 
            state: {
                productionLine: this.props.productionLine
            }}}>
              <Button
              
            >
              View Production Line
          </Button>
            </Link>
            </div>

          
            <div className="container-button">
        {editButton}
        </div></div>
      </li>
    );
  }
}

export default ProductionLineItem;