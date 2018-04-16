import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import Lots from '../../../api/Lots/Lots'
import { Button, Label, Modal, ModalHeader, ModalBody, ModalTitle, OverlayTrigger, Popover, Tooltip, Row, Col, FormGroup, ControlLabel, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import validate from '../../../modules/validate.js';
import Timer from '../Cart/Timer.js'

class EditIntermediateQuantity extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lotFields: [],
			startingLots: []
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
			},
			messages: {
				numberOfPackages: {
					required: 'Specify Number Of Packages To Order',
					number: 'Must be a number',
				},
			},
			submitHandler() {
				component.handleSubmit();
			},
		})

	}

	componentWillMount() {
		let lotsAll = this.props.lots
		let intermediate = this.props.location.state.intermediate
		let lots = null
		for (let i = 0; i < lotsAll.length; i++) {
			if (intermediate._id == lotsAll[i].inventoryID) {
				lots = lotsAll[i].queue
				break
			}
		}

		let startingArray = new Array()
		let startingLots = new Array()

		for (let i = 0; i < lots.length; i++) {
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
								defaultValue={lots[i].lot}
							/>
						</div>
						<div className="side-spacingInput">
							<input
								type="number"
								step="1"
								key={`lotStuff${i}`}
								ref={input => (this[`lotStuff${i}`] = input)}
								className="form-control"
								defaultValue={lots[i].qty}
							/>
						</div>
					</div>
				</div>
			)
			startingLots.push(lots[i].lot)
		}

		this.setState({
			lotFields: startingArray,
			startingLots: startingLots
		})
	}

	handleSubmit() {

		let numPackages = this.numberOfPackages.value
		let intermediate = this.props.location.state.intermediate
		const { history } = this.props

		if (numPackages % 1 === 0) {

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

			if (totalLots != numPackages) {
				lotError = true
				lotErrorReason = 'Number of Lot Packages not equal to above Number of Packages'
			}

			if (this.state.lotFields.length == 0) {
				lotError = true
				lotErrorReason = 'No Lots defined'
			}

			if (!lotError) {

				//edit number of units
				Meteor.call('intermediates.editTotalNumNativeUnits',
					intermediate._id,
					numPackages,
					function (error, result) {
						if (error) {
							Bert.alert(error.reason, 'danger');
						}
					})

				//edit based on lots Array



				Bert.alert('Successfully Edited Lots!', 'success')
				history.push('/formulaManagement')
			} else {
				Bert.alert(lotErrorReason, 'danger');
			}
		} else {
			Bert.alert('Number of Packages must be an Integer', 'danger');
		}
	}

	addField() {
		const lotFields = this.state.lotFields;
		let numPackages = this.numberOfPackages.value

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

		let numPackages = this.numberOfPackages.value

		numPackages % 1 === 0 ?

			this.setState((prevState) => ({
				lotFields: prevState.lotFields.slice(0, -1)
			}))
			: Bert.alert('Number of Packages must be an Integer', 'danger');
	}

	renderStartingLotNumbers() {
		let string = ''
		let startArr = this.state.startingLots
		let message = ""
		for (let i = 0; i < startArr.length; i++) {
			message += startArr[i].toString() + ", "
		}
		message = message.substring(0, message.length - 2)
		return message
	}

	render() {

		let intermediate = this.props.location.state.intermediate

		return (
			<div className="container">
				<header>
					<h1>Editing Quantity / Lots: {this.props.location.state.name}</h1>
				</header>

				<p></p>
				<p><b>NOTE</b>: Pre-existing Lot Numbers will retain its time stamp. New Lot Numbers will have the time stamp be the current time.</p>

				<p><b>Pre-existing Lot Numbers</b>: {this.renderStartingLotNumbers()}</p>

				<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

					<FormGroup>
						<ControlLabel>Number Of Packages:</ControlLabel>
						<input
							type="number"
							step="1"
							name="numberOfPackages"
							placeholder="Enter # of Packages"
							ref={numberOfPackages => (this.numberOfPackages = numberOfPackages)}
							style={{ width: '40%', height: '100%' }}
							defaultValue={intermediate.nativeInfo.totalQuantity}
							className="form-control"
						/>
					</FormGroup>

					<p></p>
					<ControlLabel>Lots:</ControlLabel>
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

					<Timer />

					<Button type="submit" bsStyle="success">Edit Lots</Button>

				</form>
				<p></p>

				<div className="container-keepLeft">
					<Link to='/formulaManagement'>Return to Formula Management</Link>
				</div>

			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('lots')
	return {
		lots: Lots.find({}).fetch()
	}
})(EditIntermediateQuantity)





