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

// Task component - represents a single todo item
export class AddVendor extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.edit) {
			return (
				<tr>
					<td>
						<VendorSelect ref="vendorSel"/>
					</td>
					<td>
						<input type="number" placeholder="Price Per Pound" onChange= {e=> {
						}} ref="price"/>
					</td>
					<td>
						<Button
							bsStyle="success"
							onClick={e => {
								console.log(this)
								console.log(this.props.ing)
								console.log(this.refs.vendorSel.vendor.value)
								Meteor.call('addVendor',
									this.props.ing,
									this.refs.vendorSel.vendor.value,
									Number(this.refs.price.value),
									function(error,result){
	                   					if(error){
	                        				console.log("something goes wrong with the following error message " + error.reason )
	               	  						Bert.alert(error.reason, 'danger');
	                  					}
									}
								);
							}}
							title= "Add Vendor"
						>Add Vendor</Button>
					</td>
				</tr>
			);
		}
		else {
			return null
		}
	}
}

export default withTracker(() => {
	Meteor.subscribe('vendors');
	return {
		vendors: Vendors.find({}).fetch(),
	};
})(AddVendor);