import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import VendorForm from './VendorForm.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'
import { Bert } from 'meteor/themeteorchef:bert';
import { Vendors } from '../../api/Vendors/vendors.js';
import convertPackageString from '../../utils/conversions.js';
import { createContainer } from 'meteor/react-meteor-data'
// import isInt from '../../utils/checks.js';

// Task component - represents a single todo item
export class IngredientForm extends Component {
	constructor(props) {
		super(props);
	}

	handleSubmit(event) {
	    event.preventDefault();

	    // Find the text field via the React ref
	    const text = ReactDOM.findDOMNode(this.refs.ingredientName).value.trim();
	    const temperatureState = ReactDOM.findDOMNode(this.refs.temperatureState).value.trim();
	    const packaging = ReactDOM.findDOMNode(this.refs.packaging).value.trim();
	    const numPackages = ReactDOM.findDOMNode(this.refs.ingredientQuantity).value.trim();
	    const quantity = numPackages * convertPackageString(packaging); //in Lbs
	    const vendorId = ReactDOM.findDOMNode(this.refs.vendors).value.trim();

		var vendor;
		for(var i = 0; i < this.props.vendors.length; i++) {
   		 if (this.props.vendors[i]._id == vendorId) {
      	  vendor = this.props.vendors[i];
      	  break;
    	 }
		}

	    //Have to implement vendor selection
	    Meteor.call("addIngredient",text,packaging,temperatureState,[vendor],numPackages,quantity, 
	    	(error) => {
	    		if (error) {
	    			Bert.alert(error.reason,'danger');
	    		}
	    		else {
	    			Bert.alert('Ingredient added','success');
	    		}
	    });
  	}
  	renderOptions() {
  		let items = [];
  		for (i = 0; i < this.props.vendors.length; i++) {
  			items.push(<option key={i} value={this.props.vendors[i]._id}>{this.props.vendors[i].vendor}</option>);
  		}
  		return items;
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
            <select id = "selVendor" ref="vendors">
            	<option value = "null">---</option>
            	{ this.renderOptions() }
			</select>
			<input type="submit" value="Submit"/>
			<Link to='/userViewInventory'>Return to Table</Link>
      </form>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('vendors');
  return {
      vendors: Vendors.find({}).fetch(),
  };
})(IngredientForm);