import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VendorForm from './VendorForm.js';

// Task component - represents a single todo item
export default class IngredientForm extends Component {
	handleSubmit(event) {
	    event.preventDefault();
	 
	    // Find the text field via the React ref
	    const text = ReactDOM.findDOMNode(this.refs.ingredientName).value.trim();
	    const temperatureState = ReactDOM.findDOMNode(this.refs.temperatureState).value.trim();
	    const packaging = ReactDOM.findDOMNode(this.refs.packaging).value.trim();

	    //Have to implement vendor selection
	    Meteor.call("addIngredient",text,parseInt(packaging),temperatureState,[]);
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
			<select id = "selPackaging" ref="packaging">
			   <option value = "50">Sack (50 lbs)</option>
			   <option value = "50">Pail (50 lbs)</option>
			   <option value = "500">Drum (500 lbs)</option>
			   <option value = "2000">Supersack (2000 lbs)</option>
			   <option value = "50000">Truckload (50000)</option>
			   <option value = "280000">Railcar (280000)</option>
			</select>
			<select id = "selTemperatureState" ref="temperatureState">
			   <option value = "Frozen">Frozen</option>
			   <option value = "Room Temperature">Room Temperature</option>
			   <option value = "Refrigerated">Refrigerated</option>
			</select>
			<input type="submit" value="Submit"/>
      </form>
      <VendorForm />
      </div>
    );
  }
}