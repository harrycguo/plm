import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import VendorForm from './VendorForm.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, BrowserRouter } from 'react-router-dom'
import { Bert } from 'meteor/themeteorchef:bert';
import { Vendors } from '../../api/Vendors/vendors.js';
import { isExistingIngredient } from '../../utils/checks.js';
import { createContainer } from 'meteor/react-meteor-data'
import { selectStyle, inputStyle } from './Styles.js';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import validate from '../../modules/validate.js';
import { VendorSelect } from './VendorSelect.js';
import CustomNativeUnitInput from './CustomNativeUnitInput.js'

// Task component - represents a single todo item
export class IngredientForm extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			usedCap: Number(0),
			totalNumNativeUnits: Number(0)
		};
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
				numPackages: {
					required: true,
					number: true,
				},
				ingredientPrice: {
					number: true
				},
				numNativeUnits: {
					number: true,
				},
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
				numPackages: {
					required: 'Specify Quantity',
				},
				ingredientPrice: {
					number: 'Must be a decimal'
				},
				numNativeUnits: {
					number: 'Must be an integer',
				},
			},
			submitHandler() { component.handleSubmit(); },
		});
	}


	handleSubmit() {

		// Find the text field via the React ref
		let name = this.ingredientName.value
		let packaging = this.packaging.value
		let temperatureState = this.temperatureState.value
		let numPackages = this.numPackages.value
		let numNativeUnitsPerPackage = this.numNativeUnits.value
		let nativeUnit = this.customNativeUnitInput.nativeUnit.value == 'custom' ? this.customNativeUnitInput.customNativeUnit.value : this.customNativeUnitInput.nativeUnit.value
		let vendorId = this.refs.vendorSel.vendor.value
		let ingredientPrice = this.ingredientPrice.value
		const { history } = this.props.hist;

		//Calculate total number of native units
		let totalNumNativeUnits = Number(numPackages) * Number(numNativeUnitsPerPackage)

		//map packaging to values
		let packagingMap = new Map();
		packagingMap.set('Sack', 0.5);
		packagingMap.set('Pail', 1.5);
		packagingMap.set('Drum', 3);
		packagingMap.set('Supersack', 6);
		packagingMap.set('Truckload', 0);
		packagingMap.set('Railcar', 0);

		let ingredientStorage = Number(packagingMap.get(packaging)) * Number(numPackages)

		for (var i = 0; i < this.props.vendors.length; i++) {
			if (this.props.vendors[i]._id == vendorId) {
				vendor = this.props.vendors[i]._id;
				// priceObj = {vendorId: vendor._id, vendorPrice: priceVal};	
				break;
			}
		}
		if (vendorId == "null") {
			vendor = {};
		}

		let user = Meteor.user();
		let returnLink = null;

		if (Roles.userIsInRole(user, ['admin'])) {
			returnLink = '/adminViewInventory'
		} else {
			returnLink = '/userViewInventory'
		}

		//Have to implement vendor selection
		if (Meteor.isServer) {
			console.log("server side");
		} else if (Meteor.isClient) {
			Meteor.call("addToExistingIngredient",
				name,
				temperatureState,
				packaging,
				numPackages,
				ingredientStorage,
				totalNumNativeUnits,
				nativeUnit,
				numNativeUnitsPerPackage,
				vendor,
				ingredientPrice,
				function (error, result) {
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

	setTwoNumberDecimal(event) {
		this.value = parseFloat(this.value).toFixed(2);
	}

	calculateCapacityUsed = () => {
		let packagingMap = new Map();
		packagingMap.set('Sack', 0.5);
		packagingMap.set('Pail', 1.5);
		packagingMap.set('Drum', 3);
		packagingMap.set('Supersack', 6);
		packagingMap.set('Truckload', 0);
		packagingMap.set('Railcar', 0);

		let packaging = this.packaging.value
		let numPackages = this.numPackages.value
		let ingredientStorage = Number(packagingMap.get(packaging)) * Number(numPackages)
		this.setState({
			usedCap: ingredientStorage,
			totalNumNativeUnits: Number(this.numPackages.value) * Number(this.numNativeUnits.value)
		})

	}

	renderOptions() {
		let items = [];
		for (i = 0; i < this.props.vendors.length; i++) {
			items.push(<option key={i} value={this.props.vendors[i]._id}>{this.props.vendors[i].vendor}</option>);
		}
		return items;
	}

	renderUsedCapacity() {
		return (
			<div>
				<b>Total Storage Used (Sq. Ft.):</b>
				<p>{this.state.usedCap}</p>
			</div>
		)
	}

	renderTotalNumNativeUnits() {
		return (
			<div>
				<b>Total Number of Native Units:</b>
				<p>{this.state.totalNumNativeUnits}</p>
			</div>
		)
	}

	render() {
		
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
							name="packaging"
							onChange={this.calculateCapacityUsed}>
							<option value="Sack">Sack (0.5 Sq. Ft.)</option>
							<option value="Pail">Pail (1.5 Sq. Ft.)</option>
							<option value="Drum">Drum (3 Sq. Ft.)</option>
							<option value="Supersack">Supersack (6 Sq. Ft.)</option>
							<option value="Truckload">Truckload (0 Sq. Ft.)</option>
							<option value="Railcar">Railcar (0 Sq. Ft.)</option>
						</select></p>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Temperature State</ControlLabel>
						<p><select id="selTemperatureState"
							ref={temperatureState => (this.temperatureState = temperatureState)}
							name="temperatureState">
							<option value="frozen">Frozen</option>
							<option value="refrigerated">Refrigerated</option>
							<option value="room temperature">Room Temperature</option>
						</select></p>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Number Of Packages</ControlLabel>
						<p><input
							type="number"
							step="1"
							ref={numPackages => (this.numPackages = numPackages)}
							onChange={this.calculateCapacityUsed}
							name="numPackages"
							placeholder="# of Packages"
							className="form-control"
						/></p>
					</FormGroup>

					{this.renderUsedCapacity()}

					<FormGroup>
						<ControlLabel>Number Of Native Units Per Package</ControlLabel>
						<p><input
							type="number"
							step="1"
							ref={numNativeUnits => (this.numNativeUnits = numNativeUnits)}
							onChange={this.calculateCapacityUsed}
							name="numNativeUnits"
							placeholder="# of Native Units Per Package"
							className="form-control"
						/></p>
					</FormGroup>

					{this.renderTotalNumNativeUnits()}

					<CustomNativeUnitInput ref={customNativeUnitInput => (this.customNativeUnitInput = customNativeUnitInput)}/>

					<FormGroup>
						<ControlLabel>Select Vendor</ControlLabel>
						<p>
							<VendorSelect ref="vendorSel" />
						</p>

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