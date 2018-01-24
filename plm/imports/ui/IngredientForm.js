import React, { Component } from 'react';
import VendorForm from './VendorForm.js';
import DropdownButton from '../../node_modules/react-bootstrap/lib/DropdownButton.js';
import MenuItem from '../../node_modules/react-bootstrap/lib/MenuItem.js';
 
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
            <input
              type="text"
              ref="ingredientPackaging"
              placeholder="Enter ingredient packaging quantity"
            />
            <DropdownButton
				bsStyle={'primary'}
				title={'primary'}
				key={1}
				id={`dropdown-basic-${1}`}
			>
				<MenuItem eventKey="1">Sack (50 lbs)</MenuItem>
				<MenuItem eventKey="2">Pail (50 lbs)</MenuItem>
				<MenuItem eventKey="3" active>
					Active Item
				</MenuItem>
				<MenuItem divider />
				<MenuItem eventKey="4">Separated link</MenuItem>
			</DropdownButton>
            <input
              type="text"
              ref="IngredientTemperatureState"
              placeholder="Enter ingredient temperature state"
            />
            <input
              type="text"
              ref="ingredientVendors"
              placeholder="Enter ingredient name"
            />
      </form>
      <VendorForm />
      </div>
    );
  }
}