import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, Button , ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import validate from '../../../modules/validate.js';

class AddProductionLine extends Component {
  constructor(props) {
    super(props);
}

componentDidMount() {

    const component = this;

    validate(component.form, {
        rules: {
            formulaName: {
                required: true,
            },
            formulaDescription: {
                required: false,
            },
            foodProductUnits: {
                required: true,
                number: true
            },

        },
        messages: {
            formulaName: {
                required: 'Specify Final Product Name',
            },
      
            foodProductUnits: {
                required: 'Specify Final Product Units',
                number: 'Must be a number',
            },
        },
        submitHandler() { 
            component.handleSubmit(); },
    });
}

  render() {

      return (
        <div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

          <FormGroup>
              <ControlLabel>Production Line Name</ControlLabel>
              <input
                  type="text"
                  name="plName"
                  placeholder="Enter Production Line Name"
                  ref={plName => (this.plName = plName)}
                  className="form-control"
              />
          </FormGroup>

          <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <textarea
                  type="text"
                  rows="3"
                  name="formulaDescription"
                  ref={formulaDescription => (this.formulaDescription = formulaDescription)}
                  className="form-control"
                  placeholder="Description of Formula"
              />
          </FormGroup>

          <FormGroup>
              <ControlLabel>Food Product Units</ControlLabel>
              <p><input
                  type="number"
                  step="1"
                  ref={foodProductUnits => (this.foodProductUnits = foodProductUnits)}
                  name="foodProductUnits"
                  placeholder="# of Product Units"
                  className="form-control"
              /></p>
          </FormGroup>

          <ControlLabel>Ingredients / Intermediate Needed:</ControlLabel>

          <p></p>

          {this.state.inputs.map(function (input, index) {
              return input;
          })}

          <Button
              bsStyle="info"
              bsSize="small"
              onClick={this.add}>
              Add Ingredient / Intermediate
          </Button>

          <p></p>
          <hr className='divider'></hr>
          <p></p>
          <Button type="submit" bsStyle="success" >
              Submit
          </Button>
          </form>
        </div>
      )
  }
}

export default AddProductionLine





