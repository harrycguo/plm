import React, { Component, PropTypes } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, BrowserRouter } from 'react-router-dom'
import { Bert } from 'meteor/themeteorchef:bert';
import { Vendors } from '../../api/Vendors/vendors.js';
import { Intermediates } from '../../api/Intermediates/intermediates.js'
import { isExistingIngredient } from '../../utils/checks.js';
import { createContainer } from 'meteor/react-meteor-data'
import { selectStyle, inputStyle } from './Styles.js';
import { Row, Col, FormGroup, ControlLabel, Button , ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
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
            ingList: [],
            radioState: true
        };

        this.add = this.add.bind(this);
    }

    componentDidMount() {

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
                    required: 'Specify Final Product Name',
                },
                formulaDescription: {
                    required: 'Specify Final Product Description',
                },
                foodProductUnits: {
                    required: 'Specify Final Product Units',
                    number: 'Must be a number',
                },
            },
            submitHandler() { 
                component.handleSubmit(); },
        });

        validate(component.formIntermediate, {
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
                packaging: {
					required: true,
				},
				temperatureState: {
					required: true,
                },
                numNativeUnitsPerPackage: {
					required: true,
					number: true,
                },

            },
            messages: {
                formulaInterName: {
                    required: 'Specify Intermediate Name',
                },
                formulaInterDescription: {
                    required: 'Specify Intermediate Description',
                },
                intermediateProductUnits: {
                    required: 'Specify Intermediate Product Units',
                    number: 'Must be a number',
                },
                packaging: {
					required: 'Specify Packaging',
				},
				temperatureState: {
					required: 'Specify Temperature State',
					number: 'Must be a number',
                },
                numNativeUnitsPerPackage: {
					required: 'Specify Number of Native Units Per Package',
					number: 'Must be an integer',
				},
            },
            submitHandler() { component.handleSubmit(); },
        });
    }

    handleSubmit() {
        this.state.radioState ? this.handleSubmitFormula() : this.handleSubmitIntermediate()
    }

    handleSubmitFormula() {
        
        let name = this.formulaName.value
        let description = this.formulaDescription.value
        let productUnits = this.foodProductUnits.value
        let ingList = this.state.ingList

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
   
        Meteor.call('formulas.insert',
            name,
            description,
            productUnits,
            ingListArray,
            function(error, result) {
                if (error){
                    Bert.alert(error.reason, 'danger');
                } else {
                    Bert.alert('Added Final Product Formula!', 'success');
                    document.getElementById("form").reset();
                    this.setState({
                        inputs: [],
                        ingList: []
                    })
                    
                }
            }.bind(this))
    }

    handleSubmitIntermediate() {

        let name = this.formulaInterName.value
        let description = this.formulaInterDescription.value
        let productUnits = this.intermediateProductUnits.value
        let ingList = this.state.ingList
        let packaging = this.packaging.value
        let temperatureState = this.temperatureState.value
        let numNativeUnitsPerPackage = this.numNativeUnitsPerPackage.value
        let nativeUnit = this.customNativeUnitInput.nativeUnit.value == 'custom' ? this.customNativeUnitInput.customNativeUnit.value : this.customNativeUnitInput.nativeUnit.value

        let numPackages = 0
        let totalNumNativeUnits = 0
        let ingredientStorage = 0

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

        Meteor.call("intermediates.insert",
                name,
                description,
                productUnits,
                ingListArray,
				temperatureState,
				packaging,
				numPackages,
				ingredientStorage,
				totalNumNativeUnits,
				nativeUnit,
				numNativeUnitsPerPackage,
				function (error, result) {
					if (error) {
						Bert.alert(error.reason, 'danger');
					}
					else {
						Bert.alert('Added Intermediate Formula!', 'success');
                        document.getElementById("formIntermediate").reset();
                        this.setState({
                            inputs: [],
                            ingList: []
                        })
                    
					}
				}.bind(this));

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

    renderFormulaForm() {
        return (
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

                    <FormGroup>
                        <ControlLabel>Final Product Name</ControlLabel>
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

                    <ControlLabel>Ingredients / Intermediate Needed:</ControlLabel>

                    <p></p>

                    {this.state.inputs.map(function (input, index) {
                        return input;
                    })}

                    <Button
                        bsStyle="info"
                        bsSize="small"
                        onClick={this.add}>
                        Add Ingredient / Intermediate
                    </Button>

                    <p></p>
                    <hr className='divider'></hr>
                    <p></p>
                    <Button type="submit" bsStyle="success" >
                        Submit
                    </Button>
                    </form>
        )
    }

    renderIntermediateForm() {
        
        return (
            <form ref={intermediateForm => (this.formIntermediate = intermediateForm)} onSubmit={event => event.preventDefault()} id='formIntermediate'>

                    <FormGroup>
                        <ControlLabel>Intermediate Name</ControlLabel>
                        <input
                            type="text"
                            name="formulaName2"
                            placeholder="Enter Formula Name"
                            ref={formulaName => (this.formulaInterName = formulaName)}
                            className="form-control"
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <textarea
                            type="text"
                            rows="3"
                            name="formulaDescription2"
                            ref={formulaDescription => (this.formulaInterDescription = formulaDescription)}
                            className="form-control"
                            placeholder="Description of Formula"
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Food Product Units</ControlLabel>
                        <p><input
                            type="number"
                            step="1"
                            ref={foodProductUnits => (this.intermediateProductUnits = foodProductUnits)}
                            name="foodProductUnits2"
                            placeholder="# of Product Units"
                            className="form-control"
                        /></p>
                    </FormGroup>
                    <FormGroup>
						<ControlLabel>Packaging</ControlLabel>
						<p><select id="selPackaging"
							ref={packaging => (this.packaging = packaging)}
							name="packaging"
							>
							<option value="Sack">Sack (0.5 Sq. Ft.)</option>
							<option value="Pail">Pail (1.5 Sq. Ft.)</option>
							<option value="Drum">Drum (3 Sq. Ft.)</option>
							<option value="Supersack">Supersack (16 Sq. Ft.)</option>
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
						<ControlLabel>Number Of Native Units Per Package</ControlLabel>
						<p><input
							type="number"
							step="1"
							ref={numNativeUnitsPerPackage => (this.numNativeUnitsPerPackage = numNativeUnitsPerPackage)}
							//onChange={this.calculateCapacityUsed}
							name="numNativeUnitsPerPackage"
							placeholder="# of Native Units Per Package"
							className="form-control"
						/></p>
					</FormGroup>

					<CustomNativeUnitInput ref={customNativeUnitInput => (this.customNativeUnitInput = customNativeUnitInput)}/>

                    <ControlLabel>Ingredients / Intermediate Needed:</ControlLabel>

                    <p></p>

                    {this.state.inputs.map(function (input, index) {
                        return input;
                    })}

                    <Button
                        bsStyle="info"
                        bsSize="small"
                        onClick={this.add}>
                        Add Ingredient / Intermediate
                    </Button>

                    <p></p>
                    <hr className='divider'></hr>
                    <p></p>
                    <Button type="submit" bsStyle="success" >
                        Submit
                    </Button>
                    </form>
        )
    }

    onChangeRadio(){
 
        this.setState((prevState) => ({
            radioState: !prevState.radioState
        }))
    }

    render() {

        return (
            <div>
                <p></p>
                <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" ref={radio => (this.radio) = radio} defaultValue={1} onChange={this.onChangeRadio.bind(this)}>
                        <ToggleButton value={1}>Final Product</ToggleButton>
                        <ToggleButton value={2}>Intermediate</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
                <p></p>

                {this.state.radioState ? this.renderFormulaForm() : this.renderIntermediateForm()}
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('vendors');
    Meteor.subscribe('intermediates')
    return {
        vendors: Vendors.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch()
    };
})(AddFormulaForm);
