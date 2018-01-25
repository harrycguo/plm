import React, { Component } from 'react';
import VendorForm from './VendorForm.js';
import DropdownButton from '../../node_modules/react-bootstrap/lib/DropdownButton.js';
import MenuItem from '../../node_modules/react-bootstrap/lib/MenuItem.js';
import Button from '../../node_modules/react-bootstrap/lib/Button.js';
 
// onSubmit={this.handleSubmit.bind(this) -> Add later!

// Task component - represents a single todo item
export default class IngredientForm extends Component {
  render() {
    return (
      <div>
      <form className="new-task">
            <input
              type="text"
              ref="ingredientName"
              placeholder="Enter ingredient name"
            />
            <DropdownButton
				bsStyle={'primary'}
				title={'primary'}
				key={1}
				id={`dropdown-basic-${1}`}
			>
				<MenuItem eventKey="1">Sack (50 lbs)</MenuItem>
				<MenuItem eventKey="2">Pail (50 lbs)</MenuItem>
				<MenuItem eventKey="3">Drum (500 lbs)</MenuItem>
				<MenuItem eventKey="4">Supersack (2000 lbs)</MenuItem>
				<MenuItem eventKey="5">Truckload (50000 lbs)</MenuItem>
				<MenuItem eventKey="6">Railcar (280000 lbs)</MenuItem>
			</DropdownButton>
            <DropdownButton
				bsStyle={'primary'}
				title={'primary'}
				key={2}
				id={`dropdown-basic-${2}`}
			>
				<MenuItem eventKey="1">frozen</MenuItem>
				<MenuItem eventKey="2">refrigerated</MenuItem>
				<MenuItem eventKey="3">room temperature</MenuItem>
			</DropdownButton>
			<Button bsStyle="primary" bsSize="default">
				Submit
			</Button>
      </form>
      <VendorForm />
      </div>
    );
  }
}