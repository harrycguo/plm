import React, { Component, PropTypes } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, BrowserRouter } from 'react-router-dom'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import validate from '../../modules/validate.js';

export class CustomNativeUnitsInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showCustomField: this.props.defaultValue == undefined || this.props.defaultValue == 'Pounds' || this.props.defaultValue == 'Gallons' ? false : true
		};
    }

    componentDidMount() {

		const component = this;

		validate(component.form, {
			rules: {
				nativeUnit: {
					required: true,
				},
			},
			messages: {
				nativeUnit: {
					required: 'Specify A Native Unit',
				},
			},
			submitHandler() { component.handleSubmit(); },
		});
	}

    renderCustomFieldTrigger = () => {
		let nativeUnit = this.nativeUnit.value
		if (nativeUnit == 'custom') {
			this.setState({ showCustomField: true })
		} else {
			this.setState({ showCustomField: false })
		}
    }
    
    renderCustomField() {
		return this.state.showCustomField ? (
			<p><input
							type="text"
							ref={customNativeUnit => (this.customNativeUnit = customNativeUnit)}
							name="customNativeUnit"
							defaultValue={ (this.props.defaultValue != undefined && this.props.defaultValue != 'Pounds' && this.props.defaultValue != 'Gallons') ? this.props.defaultValue : "" }
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
							<option value="Pounds" selected={this.props.defaultValue == 'Pounds'}>Pounds</option>
							<option value="Gallons" selected={this.props.defaultValue == 'Gallons'}>Gallons</option>
							<option value="custom" selected={this.props.defaultValue != undefined && this.props.defaultValue != 'Pounds' && this.props.defaultValue != 'Gallons'}>Custom...</option>
						</select></p>
					</FormGroup>

                    {this.renderCustomField()}
            </div>
        )
    }
}

export default CustomNativeUnitsInput 