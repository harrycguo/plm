import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import VendorForm from './VendorForm.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Link , BrowserRouter} from 'react-router-dom'
import { Bert } from 'meteor/themeteorchef:bert';
import { Vendors } from '../../api/Vendors/vendors.js';
import convertPackageString from '../../utils/conversions.js';
import { isExistingIngredient } from '../../utils/checks.js';
import { createContainer } from 'meteor/react-meteor-data'
import { selectStyle, inputStyle } from './Styles.js';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import validate from '../../modules/validate.js';

// import isInt from '../../utils/checks.js';

// Task component - represents a single todo item
export class IngredientForm extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {

		const component = this;

		validate(component.form, {
			rules: {
				ingredientName: {
					required: true,
				},
				packaging: {
					required: true,
				},
				temperatureState: {
					required: true,
				},
				ingredientQuantity: {
					required: true,
					number: true,
				},
				vendor: {
					required: true,
				},
				ingredientPrice: {
					required: true,
					number: true,
				}
			},
			messages: {
				ingredientName: {
					required: 'Specify Ingredient Name',
				},
				packaging: {
					required: 'Specify Packaging',
				},
				temperatureState: {
					required: 'Specify Temperature State',
					number: 'Must be a number',
				},
				ingredientQuantity: {
					required: 'Specify Quantity',
				},
				vendor: {
					required: 'Specify Vendor',
				},
				ingredientPrice: {
					required: 'Specify Price',
					number: 'Must be a decimal'
				}
			},
			submitHandler() { component.handleSubmit(); },
		});
	}


	handleSubmit() {

		// Find the text field via the React ref
		let name = this.ingredientName.value
		let packaging = this.packaging.value
		let temperatureState = this.temperatureState.value
		let ingredientQuantity = this.ingredientQuantity.value
		let vendorId = this.vendor.value
		let ingredientPrice = this.ingredientPrice.value
		const { history } = this.props.hist;

		for (var i = 0; i < this.props.vendors.length; i++) {
			if (this.props.vendors[i]._id == vendorId) {
				vendor = this.props.vendors[i];
				// priceObj = {vendorId: vendor._id, vendorPrice: priceVal};
				break;
			}
		}

		let user = Meteor.user();
		let returnLink = null;
		
		if (Roles.userIsInRole(user, ['admin'])) {
			returnLink = '/adminViewInventory'
		} else {
			returnLink = '/userViewInventory'
		}

		//Have to implement vendor selection
		if (Meteor.isServer){
			console.log("server side");
		 } else if (Meteor.isClient){
		Meteor.call("addToExistingIngredient",
			name,
			packaging,
			temperatureState,
			vendor,
			ingredientQuantity,
			ingredientPrice,
			function(error,result){
				if (error) {
					Bert.alert(error.reason, 'danger');
				}
				else {
					Bert.alert('Ingredient added', 'success');
					history.push(returnLink)
				}
			});
		 }

	}

	renderOptions() {
		let items = [];
		for (i = 0; i < this.props.vendors.length; i++) {
			items.push(<option key={i} value={this.props.vendors[i]._id}>{this.props.vendors[i].vendor}</option>);
		}
		return items;
	}

	setTwoNumberDecimal(event) {
    this.value = parseFloat(this.value).toFixed(2);
	}

	render() {
		let user = Meteor.user();
		let returnLink = null;

		if (Roles.userIsInRole(user, ['admin'])) {
			returnLink = <Link to='/adminViewInventory'>Return to Table</Link>
		} else {
			returnLink = <Link to='/userViewInventory'>Return to Table</Link>
		}

		return (

			<div className="container">
				<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
					<FormGroup>
						<ControlLabel>Ingredient Name</ControlLabel>
						<input
							type="text"
							name="ingredientName"
							placeholder="Enter Ingredient Name"
							ref={ingredientName => (this.ingredientName = ingredientName)}
							className="form-control"
						/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Packaging</ControlLabel>
						<p><select id="selPackaging"
							ref={packaging => (this.packaging = packaging)}

							name="packaging">
							<option value="Sack">Sack (50 lbs)</option>
							<option value="Pail">Pail (50 lbs)</option>
							<option value="Drum">Drum (500 lbs)</option>
							<option value="Supersack">Supersack (2000 lbs)</option>
							<option value="Truckload">Truckload (50000)</option>
							<option value="Railcar">Railcar (280000)</option>
						</select></p>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Temperature State</ControlLabel>
						<p><select id="selTemperatureState"
							ref={temperatureState => (this.temperatureState = temperatureState)}

							name="temperatureState">
							<option value="Frozen">Frozen</option>
							<option value="Room Temperature">Room Temperature</option>
							<option value="Refrigerated">Refrigerated</option>
						</select></p>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Ingredient Quantity</ControlLabel>
						<p><input
							type="number" step="any"
							ref={ingredientQuantity => (this.ingredientQuantity = ingredientQuantity)}

							name="ingredientQuantity"
							placeholder="# of Packages"
							className="form-control"
						/></p>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Select Vendor</ControlLabel>
						<p><select id="selVendor"
							ref={vendor => (this.vendor = vendor)}

							name="vendor">
							{this.renderOptions()}
						</select></p>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Ingredient Price</ControlLabel>
						<p><input
							type="number" step="0.01"
							ref={ingredientPrice => (this.ingredientPrice = ingredientPrice)}
							placeholder="Enter price"
							name="ingredientPrice"
							onChange={this.setTwoNumberDecimal()}
							className="form-control"
						/></p>
					</FormGroup>

					<Button type="submit" bsStyle="success">Add Ingredient</Button>
					<p></p>
					<p>{returnLink}</p>

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