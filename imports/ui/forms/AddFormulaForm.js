import React, { Component, PropTypes } from 'react';
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
import FormulaIngredientInput from '../components/FormulaIngredientInput/FormulaIngredientInput.js'

export class AddFormulaForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            ingredients: []
        };

        this.add = this.add.bind(this);
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
        console.log("yeahhhh")
        console.log(this.state.ingredients)
        console.log(this.state.ingredients[0].testing)
        console.log(this.testing)

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
        packagingMap.set('Supersack', 16);
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

    add() {
        
        const ingredients = this.state.ingredients;
        this.setState({
            ingredients: ingredients.concat(<FormulaIngredientInput key={ingredients.length} />)
        });
    }

    render() {

        return (
            <div className="container">

                <FormGroup>
                    <ControlLabel>Formula Name</ControlLabel>
                    <input
                        type="text"
                        name="formulaName"
                        placeholder="Enter Formula Name"
                        ref={formulaName => (this.formulaName = formulaName)}
                        className="form-control"
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <textarea
                        type="text"
                        rows="3"
                        name="description"
                        ref={description => (this.description = description)}
                        className="form-control"
                        placeholder="Description of Formula"
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Food Product Units</ControlLabel>
                    <p><input
                        type="number"
                        step="1"
                        ref={foodProductUnits => (this.foodProductUnits = foodProductUnits)}
                        name="foodProductUnits"
                        placeholder="# of Product Units"
                        className="form-control"
                    /></p>
                </FormGroup>

                <ControlLabel>Ingredients Needed:</ControlLabel>

                <p></p>
                <FormulaIngredientInput/>
                <p></p>

                {this.state.ingredients.map(function(input, index) {
                        return <div className="containerSome" key={index} >{input}</div>;
                })}
              
                <Button 
                    bsStyle="info"
                    bsSize="small"
                    onClick={this.add}>
                    Add Ingredient
                </Button>

                <p></p>
                <p></p>
                <p></p>
                <Button type="submit" bsStyle="success" onClick={this.handleSubmit} >Add New Formula</Button>


            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('vendors');
    return {
        vendors: Vendors.find({}).fetch(),
    };
})(AddFormulaForm);