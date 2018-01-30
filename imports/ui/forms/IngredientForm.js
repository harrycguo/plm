import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VendorForm from './VendorForm.js';
import { Link } from 'react-router-dom'
import { Bert } from 'meteor/themeteorchef:bert';
import Vendors from '../../api/Vendors/vendors.js';
import convertPackageString from '../../utils/conversions.js';
// import isInt from '../../utils/checks.js';

// Task component - represents a single todo item
export default class IngredientForm extends Component {
	handleSubmit(event) {
	    event.preventDefault();

	    // Find the text field via the React ref
	    const text = ReactDOM.findDOMNode(this.refs.ingredientName).value.trim();
	    const temperatureState = ReactDOM.findDOMNode(this.refs.temperatureState).value.trim();
	    const packaging = ReactDOM.findDOMNode(this.refs.packaging).value.trim();
	    const numPackages = ReactDOM.findDOMNode(this.refs.ingredientQuantity).value.trim();
	    const quantity = numPackages * convertPackageString(packaging); //in Lbs

	    //Have to implement vendor selection
	    Meteor.call("addIngredient",text,packaging,temperatureState,[],quantity, 
	    	(error) => {
	    		if (error) {
	    			Bert.alert(error.reason,'danger');
	    		}
	    		else {
	    			Bert.alert('Ingredient added','success');
	    		}
	    });
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
			   <option value = "Sack">Sack (50 lbs)</option>
			   <option value = "Pail">Pail (50 lbs)</option>
			   <option value = "Drum">Drum (500 lbs)</option>
			   <option value = "Supersack">Supersack (2000 lbs)</option>
			   <option value = "Truckload">Truckload (50000)</option>
			   <option value = "Railcar">Railcar (280000)</option>
			</select>
			<select id = "selTemperatureState" ref="temperatureState">
			   <option value = "Frozen">Frozen</option>
			   <option value = "Room Temperature">Room Temperature</option>
			   <option value = "Refrigerated">Refrigerated</option>
			</select>
			<input
              type="text"
              ref="ingredientQuantity"
              placeholder="How many packages"
            />
			<input type="submit" value="Submit"/>
			<Link to='/table'>Return to Table</Link>
      </form>
      </div>
    );
  }
}