import React, { Component, PropTypes } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { withTracker } from 'meteor/react-meteor-data';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js';
import FormulaIngredientInput from '../../components/FormulaIngredientInput/FormulaIngredientInput.js'
import FormulaIngredientInputWithDefault from '../../components/FormulaIngredientInput/FormulaIngredientInputWithDefault';


class EditFormula extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            inputs: [],
            ingList: []
        };

        this.add = this.add.bind(this);
    }

    componentWillMount() {

        let formula = this.props.location.state.formula

        for (let i = 0; i < formula.ingredientsList.length; i++) {

            this.setState((prevState) => ({
                inputs: prevState.inputs.concat(
                    <div className="containerSome" key={i}><FormulaIngredientInputWithDefault
                        key={i}
                        index={i}
                        ref={input => (this[`input${i}`] = input)}
                        defaultQuantity={formula.ingredientsList[i].amount}
                        defaultIngredient={formula.ingredientsList[i].id}
                        onChange={this.onChangeInput.bind(this)}
                    /></div>),
                ingList: prevState.ingList.concat({
                    ingredient: {
                        ingredient: formula.ingredientsList[i],
                        valid: true,
                    }
                })

            }));
        }
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
        const { history } = this.props

        let name = this.formulaName.value
        let description = this.formulaDescription.value
        let productUnits = this.foodProductUnits.value
        let ingList = this.state.ingList


        let ingListArray = new Array()

        let formula = this.props.location.state.formula
        let ogIng = formula.ingredientsList.length



        for (let i = 0; i < ingList.length; i++) {

            let objIng = ingList[i].ingredient.ingredient
        
            if (ingList[i].ingredient.valid) {
                if (objIng != null) {
                    //if has just id?
                    if (objIng.hasOwnProperty("id")) {
                        ingListArray.push({
                            id: ingList[i].ingredient.ingredient.id,
                            amount: ingList[i].ingredient.ingredient.amount
                        })
                    } else {
                        ingListArray.push({
                            id: ingList[i].ingredient.ingredient.state.ingredient,
                            amount: ingList[i].ingredient.ingredient.state.quantity
                        })
                    }

                }
                else {
                    ingListArray.push({
                        id: null,
                        amount: null
                    })
                }
            }
        }

        Meteor.call('formulas.edit',
            this.props.location.state.formula._id,
            name,
            description,
            productUnits,
            ingListArray,
            function (error, result) {
                if (error) {
                    Bert.alert(error.reason, 'danger');
                } else {
                    Bert.alert('Edited Formula!', 'success');
                    history.push('/formulaManagement')
                }
            })
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
            ingList: prevState.ingList.concat({
                ingredient: {
                    ingredient: null,
                    valid: true,
                    id: null
                }
            })

        }));
    }

    onChangeInput(index, componentToBeUpdated, valid) {

        let inputs = this.state.inputs
        let ingList = this.state.ingList

        ingList[index].ingredient = {
            ingredient: componentToBeUpdated,
            valid: true,
        }



        if (!valid) {
            inputs[index] = <div className="containerEmpty" key={index}></div>
            ingList[index].ingredient = {
                ingredient: null,
                valid: false,
                id: null,
            }
        }

        this.setState({
            inputs: inputs,
            ingList: ingList,
        })

    }

    render() {

        return (

            <div className="container">

                <header>
                    <h1>Edit Formula: {this.props.location.state.formula.name}</h1>
                </header>
      
                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>

                    <FormGroup>
                        <ControlLabel>Formula Name</ControlLabel>
                        <input
                            type="text"
                            name="formulaName"
                            placeholder="Enter Formula Name"
                            ref={formulaName => (this.formulaName = formulaName)}
                            defaultValue={this.props.location.state.formula.name}
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
                            defaultValue={this.props.location.state.formula.description}
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
                            defaultValue={this.props.location.state.formula.productUnits}
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

                    <Button type="submit" bsStyle="success">
                        Submit
                    </Button>

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
    Meteor.subscribe('vendors');
    return {
        vendors: Vendors.find({}).fetch(),
    };
})(EditFormula);
