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

export class CustomNativeUnitsInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCustomField: false,
		};
    }

    renderCustomFieldTrigger = () => {
		let nativeUnit = this.nativeUnit.value
		if (nativeUnit == 'custom') {
			this.setState({ showCustomField: true })
		}
    }
    
    renderCustomField() {
		return this.state.showCustomField ? (
			<p><input
							type="text"
							ref={customNativeUnit => (this.customNativeUnit = customNativeUnit)}
							name="customNativeUnit"
							placeholder="Native Unit"
							className="form-control"
						/></p>
		) : null
    }
    
    render() {
        return (
            <div>
            <FormGroup>
						<ControlLabel>Native Unit</ControlLabel>
						<p><select
							ref={nativeUnit => (this.nativeUnit = nativeUnit)}
							name="nativeUnit"
							placeholder="# of Native Units Per Package"
							onChange={this.renderCustomFieldTrigger}
							className="form-control">
							<option value="Pounds">Pounds</option>
							<option value="Gallons">Gallons</option>
							<option value="custom">Custom...</option>
						</select></p>
					</FormGroup>

                    {this.renderCustomField()}
            </div>
        )
    }
}

export default CustomNativeUnitsInput 