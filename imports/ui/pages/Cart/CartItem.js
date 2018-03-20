import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsApi from '../../../api/Ingredients/IngredientsApi.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { Button, Label, Modal, ModalHeader, ModalBody, ModalTitle, OverlayTrigger, Popover, Tooltip, Row, Col, FormGroup, ControlLabel, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import validate from '../../../modules/validate.js';

class CartItem extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		let ingredient = this.props.ingredient
		
		this.state = {
			show: false,
			totalQuantity: Number(0),
			totalCost: Number(0)
		};
	}

	componentDidMount() {

		const component = this;

		validate(component.form, {
				rules: {
					numberOfPackages: {
								required: true,
								number: true
						},
						vendor: {
								required: true,
								
						},

				},
				messages: {
					numberOfPackages: {
								required: 'Specify Number Of Packages To Order',
								number: 'Must be a number',
						},
						vendor: {
								required: 'Specify A Vendor',
								
						},
				},
				submitHandler() { component.handleSubmit(); },
		});
}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	handleSubmitModal() {

		let ingredient = this.props.ingredient

		//change quantity in the cart
		Meteor.call('cart.changeQuantity', 
						ingredient.fullIng.ingredient,
						this.numberOfPackages.value,
						function(error,result){
							if (error) {
								console.log("something goes wrong with the following error message " + error.reason)
								Bert.alert(error.reason, 'danger');
							}
						}
		)

		//Change Vendor
		Meteor.call('cart.changeVendor',
				ingredient.fullIng.ingredient,
				this.vendor.value,
				function (error, result) {
					if (error) {
						console.log("something goes wrong with the following error message " + error.reason)
						Bert.alert(error.reason, 'danger');
					}
				}
			)

		this.setState({ show: false });
		console.log('submitted changes!')
	}

	getQuantityPerPackage(ingMap, ingredient) {
		var totalNum = ingMap.get(ingredient.fullIng.ingredient).nativeInfo.numNativeUnitsPerPackage
		return (totalNum.toString().concat(" ").concat(ingMap.get(ingredient.fullIng.ingredient).nativeInfo.nativeUnit))
	}

	getTotalQuantity(ingMap, ingredient) {
		var totalNum = ingMap.get(ingredient.fullIng.ingredient).nativeInfo.numNativeUnitsPerPackage * ingredient.amt
		return (totalNum.toString().concat(" ").concat(ingMap.get(ingredient.fullIng.ingredient).nativeInfo.nativeUnit))
	}

	getLotsText(ingredient) {
		return ingredient.lotsSelected ? <Label bsStyle="success">Yes</Label> : <Label bsStyle="danger">No</Label>
	}

	remove() {
		Meteor.call('removeIngredientFromCart', this.fullIng.ingredient,
			function (error, result) {
				if (error) {
					console.log("something goes wrong with the following error message " + error.reason)
					Bert.alert(error.reason, 'danger');
				}
			}
		);
	}

	renderVendorSelector(ingredient, vendorMap, vendorInfo) {
		var ingredientVendors = ingredient.vendorInfo
		let items = new Array();
		ingredientVendors.forEach(function (possibleVendor) {
			var newVendorId = possibleVendor.vendor
			if (vendorMap.get(newVendorId)) {
				var newVendorName = vendorMap.get(newVendorId).vendor
				var oldVendorId = vendorInfo._id
				var oldVendorName = vendorMap.get(oldVendorId).vendor
				if (oldVendorId == newVendorId) {
					items.push(
						<option selected="selected" key={newVendorId} value={newVendorId}>
							{newVendorName + ' | ' + Number(possibleVendor.price).toFixed(2)}
						</option>)
				} else {
					items.push(
						<option key={newVendorId} value={newVendorId}>
							{newVendorName + ' | ' + Number(possibleVendor.price).toFixed(2)}
						</option>)
				}
			}
		})

			return (
				<p><select
					name="vendor"
					ref={vendor => (this.vendor = vendor)}
					>
					{items}
				</select></p>
			)
	}

	// onChange={e => {
	// 	var message = "Change vendor in cart from "
	// 	message = message.concat(vendorMap.get(vendorInfo._id).vendor).concat(" to ").concat(vendorMap.get(e.target.value).vendor)
	// 	if (confirm(message)) {
	// 		
	// 	} else {
	// 		e.target.value = vendorInfo._id
	// 	}
	// }
	// }


	renderModal() {
		const popover = (
			<Popover id="modal-popover" title="popover">
				very popover. such engagement
        </Popover>
		);

		const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

		var vendorMap = new Map();
		var ingMap = new Map();

		this.props.vendors.forEach(function (vend) {
			vendorMap.set(vend._id, vend);
		});

		this.props.ingredients.forEach(function (ing) {
			ingMap.set(ing._id, ing);
		});

		let ingredient = this.props.ingredient
		console.log(ingredient)

		return (
			<Modal show={this.state.show} onHide={this.handleClose}>
				<Modal.Header>
					<Modal.Title><b>Editing Cart Item</b>: {ingMap.get(ingredient.fullIng.ingredient).name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

						<FormGroup>
							<ControlLabel>Number Of Packages:</ControlLabel>
							<input
								type="number"
								step="1"
								name="numberOfPackages"
								placeholder="Enter Formula Name"
								ref={numberOfPackages => (this.numberOfPackages = numberOfPackages)}
								defaultValue={ingredient.amt}
								className="form-control"
							/>
						</FormGroup>

						<FormGroup>
							<ControlLabel>Select Vendor</ControlLabel>
							{this.renderVendorSelector(
									ingMap.get(ingredient.fullIng.ingredient),
									vendorMap,
									vendorMap.get(ingredient.fullIng.vendorInfo.vendor))}
						</FormGroup>

			

					

						<ControlLabel>Lots:</ControlLabel>
						<p></p>


						<Button type="submit" bsStyle="success" onClick={this.handleSubmitModal.bind(this)}>Submit Edits</Button>
					</form>

				</Modal.Body>

			</Modal>

		)
	}

	render() {

		var vendorMap = new Map();
		var ingMap = new Map();

		this.props.vendors.forEach(function (vend) {
			vendorMap.set(vend._id, vend);
		});

		this.props.ingredients.forEach(function (ing) {
			ingMap.set(ing._id, ing);
		});

		let ingredient = this.props.ingredient

		return (

			<tr key={ingredient.key}>
				<td>{ingMap.get(ingredient.fullIng.ingredient).name}</td>
				<td>{ingredient.fullIng.numPackages}</td>
				<td>{this.getQuantityPerPackage(ingMap, ingredient)}</td>
				<td>{vendorMap.get(ingredient.fullIng.vendorInfo.vendor).vendor}</td>
				<td align="right">{Number(ingredient.fullIng.vendorInfo.price).toFixed(2)}</td>
				<td>{this.getTotalQuantity(ingMap, ingredient)}</td>
				<td align="right">{Number(ingredient.fullIng.vendorInfo.price * ingredient.fullIng.numPackages).toFixed(2)}</td>
				<td align="center">{this.getLotsText(ingredient)}</td>
				<td>
					<Button
						bsStyle="info"
						bsSize='small'
						onClick={this.handleShow}
						title="Edit">
						Edit Item / Select Lots
					</Button>
				</td>
				<td>
					<Button
						bsStyle="danger"
						bsSize='small'
						onClick={this.remove.bind(ingredient)}
						title="Remove">
						Remove From Cart
					</Button>
				</td>

				{this.renderModal()}
			</tr>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('vendors')
	Meteor.subscribe('ingredients')

	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
	};
})(CartItem);