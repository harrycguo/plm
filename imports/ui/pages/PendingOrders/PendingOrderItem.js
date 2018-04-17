import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsApi from '../../../api/Ingredients/IngredientsApi.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { Button, Label, Modal, ModalHeader, ModalBody, ModalTitle, OverlayTrigger, Popover, Tooltip, Row, Col, FormGroup, ControlLabel, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import validate from '../../../modules/validate.js';

class PendingOrderItem extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		let ingredient = this.props.ingredient

		this.state = {
			show: false,
			lotFields: []
		};
	}
	componentWillMount() {
		let lots = this.props.ingredient.fullIng.lots
		let startingArray = new Array()
		for (let i = 0; i < lots.length; i++){
			startingArray.push(
				<div className="containerSome" key={i}>
						<div className="side-container-zero" key={i}>
							<div className="side-spacingInput">
								<input
									type="number"
									step="1"
									key={`lot${i}`}
									ref={input => (this[`lot${i}`] = input)}
									className="form-control"
									defaultValue={lots[i].lotNumber}
								/>
							</div>
							<div className="side-spacingInput">
								<input
									type="number"
									step="1"
									key={`lotStuff${i}`}
									ref={input => (this[`lotStuff${i}`] = input)}
									className="form-control"
									defaultValue={lots[i].lotStuff}
								/>
							</div>
						</div>
					</div>
			)
		}
		this.setState({
			lotFields: startingArray
		})
	}
	
	componentWillReceiveProps(nextProps){
		let lots = nextProps.ingredient.fullIng.lots
		let startingArray = new Array()
		for (let i = 0; i < lots.length; i++){
			startingArray.push(
				<div className="containerSome" key={i}>
						<div className="side-container-zero" key={i}>
							<div className="side-spacingInput">
								<input
									type="number"
									step="1"
									key={`lot${i}`}
									ref={input => (this[`lot${i}`] = input)}
									className="form-control"
									defaultValue={lots[i].lotNumber}
								/>
							</div>
							<div className="side-spacingInput">
								<input
									type="number"
									step="1"
									key={`lotStuff${i}`}
									ref={input => (this[`lotStuff${i}`] = input)}
									className="form-control"
									defaultValue={lots[i].lotStuff}
								/>
							</div>
						</div>
					</div>
			)
		}
		this.setState({
			lotFields: startingArray
		})
	}

	componentDidUpdate(nextProps, nextState){
		
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
				submitHandler() { 
					console.log('sdflj')
					component.handleSubmitModal(); },
			})
		 
	}

	handleClose() {
		let message = 'WARNING: Edits are not saved until you press Submit!'
		if(confirm(message)) {
			this.setState({ show: false });
		}
		
	}

	handleShow() {
		this.setState({ show: true });
	}

	handleSubmitModal() {

		let ingredient = this.props.ingredient
		let status = this.status.value

			let lotsArray = new Array()
			let lotsSet = new Set()
			let lotError = false
			let lotErrorReason = ''
			let totalLots = 0

			for (let i = 0; i < this.state.lotFields.length; i++) {
				let lot = this[`lot${i}`].value
				let lotStuff = this[`lotStuff${i}`].value

				//if blank
				if (lot == '' || lotStuff == '') {
					lotError = true
					lotErrorReason = 'Null entries when defining Lots'
					break
				} 

				//lot number not integer
				else if (lot % 1 !== 0) {
					lotError = true
					lotErrorReason = 'Lot number(s) not integer'
					break
				}

				//if negative values
				else if (lot <= 0 || lotStuff <= 0) {
					lotError = true
					lotErrorReason = 'Lots and Lot Numbers must be greater than 0'
					break
				} 

				//if multiple lots same
				else if (lotsSet.has(lot)) {
					lotError = true
					lotErrorReason = 'Multiple same Lot Numbers defined'
					break
				}

				//success lot
				else {
					lotsSet.add(lot)
					lotsArray.push({
						lotNumber: lot,
						lotStuff: lotStuff
					})
				}
			}

			//check if number of packages correct
			for (let i = 0; i < this.state.lotFields.length; i++) {
				totalLots += Number(this[`lotStuff${i}`].value)
			}

			if (totalLots != ingredient.amt) {
				lotError = true
				lotErrorReason = 'Number of Lot Packages not equal to above Number of Packages'
			}

			if (this.state.lotFields.length == 0) {
				lotError = true
				lotErrorReason = 'No Lots Selected'
			}

			if (!lotError) {

				let lotsArrived = status == 'arrived' ? true : false

				Meteor.call('cart.changeLots',
					ingredient.fullIng.ingredient,
					lotsArray,
					ingredient.fullIng.numPackages,
					lotsArrived,
					function (error, result) {
						if (error) {
							console.log("something goes wrong with the following error message " + error.reason)
							Bert.alert(error.reason, 'danger');
						}
					})

				this.setState({ show: false });
				Bert.alert('Successfully Updated Pending Order!', 'success')
			} else {
				Bert.alert(lotErrorReason, 'danger');
			}


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
		return ingredient.fullIng.lotsSelected ? <Label bsStyle="success">Arrived</Label> : <Label bsStyle="warning">Pending</Label>
	}


	addField() {
		const lotFields = this.state.lotFields;
		let numPackages = this.props.ingredient.amt

		numPackages % 1 === 0 ?
			this.setState((prevState) => ({
				lotFields: prevState.lotFields.concat(
					<div className="containerSome" key={lotFields.length}>
						<div className="side-container-zero" key={lotFields.length}>
							<div className="side-spacingInput">
								<input
									type="number"
									step="1"
									key={`lot${lotFields.length}`}
									ref={input => (this[`lot${lotFields.length}`] = input)}
									className="form-control"
								/>
							</div>
							<div className="side-spacingInput">
								<input
									type="number"
									step="1"
									key={`lotStuff${lotFields.length}`}
									ref={input => (this[`lotStuff${lotFields.length}`] = input)}
									className="form-control"
								/>
							</div>
						</div>
					</div>
				)
			}))
			: Bert.alert('Number of Packages must be an Integer', 'danger');
	}

	removeField() {

		const lotFields = this.state.lotFields;

		let numPackages = this.props.ingredient.amt

		numPackages % 1 === 0 ?

			this.setState((prevState) => ({
				lotFields: prevState.lotFields.slice(0, -1)
			}))
			: Bert.alert('Number of Packages must be an Integer', 'danger');
	}

	renderModal() {

		var ingMap = new Map();

		this.props.ingredients.forEach(function (ing) {
			ingMap.set(ing._id, ing);
		});

		let ingredient = this.props.ingredient

		return (
			<Modal show={this.state.show} onHide={this.handleClose} ref={modal => (this.modal) = modal}>
				<Modal.Header>
					<Modal.Title><b>Update Pending Order</b>: {ingMap.get(ingredient.fullIng.ingredient).name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

						<ControlLabel>Order Status:</ControlLabel>
						<p><select id="status"
							ref={status => (this.status = status)}
							name="packaging"
							defaultValue= {ingredient.fullIng.lotsSelected ? "arrived" : "pending"}>
							
							<option value="pending">Pending</option>
							<option value="arrived">Arrived</option>
						</select></p>

						<p><b>Number of Packages Ordered:</b> {ingredient.amt}</p>

						<div className="containerSome">
							<div className="side-container-zero">
								<div className="side-spacingInput">
									<b>Lot Number:</b>

								</div>
								<div className="side-spacingInput">
									<b>Number of Packages:</b>
								</div>

							</div>
						</div>

						{this.state.lotFields.map(function (lotField, index) {
							return lotField;
						})}

						<div className="containerSome">
							<ButtonToolbar>
								<ButtonGroup>
									<Button onClick={this.addField.bind(this)}>
										+
								</Button>
									<Button onClick={this.removeField.bind(this)}>
										-
								</Button>
								</ButtonGroup>
							</ButtonToolbar>
						</div>
					</form>

				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" bsStyle="success" onClick={this.handleSubmitModal.bind(this)}>Submit</Button>
				</Modal.Footer>


			</Modal>

		)
	}

	render() {

		var vendorMap = new Map();
		var ingMap = new Map();

		this.props.vendors.forEach(function (vend) {
			vendorMap.set(vend._id, vend.vendor);
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
				<td>{vendorMap.get(ingredient.fullIng.vendorInfo.vendor)}</td>
				<td align="right">${Number(ingredient.fullIng.vendorInfo.price).toFixed(2)}</td>
				<td>{this.getTotalQuantity(ingMap, ingredient)}</td>
				<td align="right">${Number(ingredient.fullIng.vendorInfo.price * ingredient.fullIng.numPackages).toFixed(2)}</td>
				<td align="center">{this.getLotsText(ingredient)}</td>
				<td>
					<Button
						bsStyle="info"
						bsSize='small'
						onClick={this.handleShow}
						title="Edit">
						Change Status / Select Lots
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
})(PendingOrderItem);