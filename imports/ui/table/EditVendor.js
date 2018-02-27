import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Link , BrowserRouter} from 'react-router-dom'
import { Bert } from 'meteor/themeteorchef:bert';
import { Vendors } from '../../api/Vendors/vendors.js';
import { isExistingIngredient } from '../../utils/checks.js';
import { createContainer } from 'meteor/react-meteor-data'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { VendorSelect } from '../forms/VendorSelect.js';

// import isInt from '../../utils/checks.js';
// select id="selVendor"
// 	ref={vendor => (this.vendor = vendor)}
// 	name="vendor">
// 	{this.renderOptions()}
// </select>

export class EditVendor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: props.edit
		}
	}

	renderPriceField() {
			return this.props.source == "table" ? 
			(
				<td> 
					<input type="number"  
					defaultValue={this.props.vendor.price}
					onBlur = {e=> {
						var message = "Change price from "
						message = message.concat(this.props.vendor.price).concat(" to ").concat(e.target.value).concat("?\n")
						message = message.concat("You will still need to submit changes!")

						if(confirm(message=message)){
							// Make the edit happen
						}else{
							e.target.value=this.props.vendor.price
						}
					}} 
					ref="price"/>
				</td>
			) : (
				<td>
					{this.props.vendor.price}
				</td>
			);
	}
	renderButton(){
		return this.props.noButton && !this.state.edit ? null : (
		<td>
		<Button
			bsStyle="success"
			onClick={e => {
				if(this.props.source == "table") {
					if(confirm("Update vendor?")) {
						// Full Ingredient: 
						console.log(this.props.ing)
						// Vendor id: 
						console.log(this.refs.vendorSel.vendor.value)
						// New price: 
						console.log(this.refs.price.value)
						Meteor.call('editPrice', 
							this.props.ing._id, 
							this.refs.vendorSel.vendor.value, 
							Number(this.refs.price.value),
							function(error, result) {
								if (error){
				                    Bert.alert(error.reason, 'danger');
				                }
							}
						)
					}
				}
				var success = false;
				this.state.edit = !this.state.edit
				this.forceUpdate()
			}}
			title= "Edit Vendor"
		>{!this.state.edit && this.props.source == "cart" ? "Edit" : "Submit Edits"}</Button>
		</td>)
	}
	render() {
		if(this.props.edit != undefined) {
			this.state.edit = this.props.edit
		}
		return (
			<>
			<td>
				<VendorSelect edit={this.state.edit} source ={this.props.source}vendor={this.props.vendor} ref="vendorSel" />
			</td>
			{this.renderPriceField()}
			{this.renderButton()}
			</>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('vendors');
	return {
		vendors: Vendors.find({}).fetch(),
	};
})(EditVendor);