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

if (Meteor.isClient) {
    Meteor.subscribe('formulas')
}

export class AddFormulaForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            inputs: [],
            ingList: []
        };

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        console.log(this)
        console.log(this.form)
        const component = this;

        validate(component.form, {
            rules: {
                formulaName: {
                    required: true,
                },
                formulaDescription: {
                    required: true,
                },
                foodProductUnits: {
                    required: true,
                    number: true
                },

            },
            messages: {
                formulaName: {
                    required: 'Specify Formula Name',
                },
                formulaDescription: {
                    required: 'Specify Formula Description',
                },
                foodProductUnits: {
                    required: 'Specify Food Product Units',
                    number: 'Must be a number',
                },
            },
            submitHandler() { component.handleSubmit(); },
        });
    }


    handleSubmit() {
        console.log("Adding Formula Now")
        const { history } = this.props.hist;

        let name = this.formulaName.value
        let description = this.formulaDescription.value
        let productUnits = this.foodProductUnits.value
        let ingList = this.state.ingList

        console.log("ingredient list below")
        console.log(ingList)

        let ingListArray = new Array()

        for (let i = 0; i < ingList.length; i++){
            //if valid (on screen) ADD
            if (ingList[i].ingredient.valid) {
   
                if (ingList[i].ingredient.ingredient != null) {
                    ingListArray.push({
                        id: ingList[i].ingredient.ingredient.state.ingredient,
                        amount: ingList[i].ingredient.ingredient.state.quantity
                    })
                } else {
                 
                    ingListArray.push({
                        id: null,
                        amount: null
                    })
                }
            }
        }

        console.log('ingListArray')
        console.log(ingListArray)
   
        Meteor.call('formulas.insert',
            name,
            description,
            productUnits,
            ingListArray,
            function(error, result) {
                if (error){
                    Bert.alert(error.reason, 'danger');
                } else {
                    Bert.alert('Added Formula!', 'success');
                    document.getElementById("form").reset();
                    this.setState({
                        inputs: [],
                        ingList: []
                    })
                    console.log(this.state)
                }
            }.bind(this))
        
    }

    add() {
        const inputs = this.state.inputs;
        this.setState((prevState) => ({
            inputs: prevState.inputs.concat(
                <div className="containerSome" key={inputs.length}><FormulaIngredientInput
                    key={inputs.length}
                    index={inputs.length}
                    ref={input => (this[`input${inputs.length}`] = input)}
                    onChange={this.onChangeInput.bind(this)}
                /></div>),
            ingList: prevState.ingList.concat({ ingredient: {
                ingredient: null,
                valid: true,
            } })
        }))
    }

    onChangeInput(index, componentToBeUpdated, valid) {
        
        let inputs = this.state.inputs
        let ingList = this.state.ingList
        
        ingList[index].ingredient = {
            ingredient: componentToBeUpdated,
            valid: true
        }

        if (!valid) {
            inputs[index] = <div className="containerEmpty" key={index}></div>
            ingList[index].ingredient = {
                ingredient: null,
                valid: false,
            }
        }

        this.setState({
            inputs: inputs,
            ingList: ingList,
        })

    }

    render() {

        return (
            <div>

                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>
            
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
                            name="formulaDescription"
                            ref={formulaDescription => (this.formulaDescription = formulaDescription)}
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

                    {this.state.inputs.map(function (input, index) {
                        return input;
                    })}

                    <Button
                        bsStyle="info"
                        bsSize="small"
                        onClick={this.add}>
                        Add Ingredient
                </Button>

                    <p></p>

                    <Button type="submit" bsStyle="success" 
                    //onClick={this.handleSubmit} 
                    >
                    Add New Formula</Button>
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
})(AddFormulaForm);
