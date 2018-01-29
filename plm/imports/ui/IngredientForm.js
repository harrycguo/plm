import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VendorForm from './VendorForm.js';
import DropdownButton from '../../node_modules/react-bootstrap/lib/DropdownButton.js';
import MenuItem from '../../node_modules/react-bootstrap/lib/MenuItem.js';
import Button from '../../node_modules/react-bootstrap/lib/Button.js';
// import { IngredientsList } from '../model/IngredientList.js';
 
// onSubmit={this.handleSubmit.bind(this) -> Add later!

// Task component - represents a single todo item
export default class IngredientForm extends Component {
	handleSubmit(event) {
	    event.preventDefault();
	 
	    // Find the text field via the React ref
	    const text = ReactDOM.findDOMNode(this.refs.ingredientName).value.trim();
	    console.log(text);
	    const storage = ReactDOM.findDOMNode(this.refs.packaging).value;
	    console.log(storage);
	    console.log(this.refs);
	    // const storage = ReactDOM.findDOMNode(this.refs.temperatureState).value;
	 
	    // IngredientsList.insert({
	    //   text,
	    //   createdAt: new Date(), // current time
	    // });
	 
	    // Clear form
	    // ReactDOM.findDOMNode(this.refs.textInput).value = '';
  	}
  render() {
    return (
      <div>
      <form className="new-ingredient" onSubmit={this.handleSubmit.bind(this)}>
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
				ref="packaging"
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
				ref="temperatureState"
			>
				<MenuItem eventKey="1">frozen</MenuItem>
				<MenuItem eventKey="2">refrigerated</MenuItem>
				<MenuItem eventKey="3">room temperature</MenuItem>
			</DropdownButton>
			<input type="submit" value="Submit"/>
      </form>
      <VendorForm />
      </div>
    );
  }
}