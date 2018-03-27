import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  Formulas  from '../../../api/Formulas/formulas.js'
import { withTracker } from 'meteor/react-meteor-data';
import { Row, Col, FormGroup, ControlLabel, Button, FormControl, ButtonToolbar } from 'react-bootstrap';
import validate from '../../../modules/validate';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'
import ProductionRunItem from '../../components/ProductionRunItem/ProductionRunItem.js'
import { Vendors } from '../../../api/Vendors/vendors.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js';

class ProductionRun extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ingList: [],
            minUnits: Number(0),
            numUnitsToProduce: Number(0),
            stockDifference: null,
            notEnough: false
        }

    }

    componentDidMount() {

        const component = this;

        validate(component.form, {
            rules: {
                formula: {
                    required: true,
                },
                numUnitsProduce: {
                    required: true,
                    number: true
                },

            },
            messages: {
                formula: {
                    required: 'Specify Formula',
                },
                numUnitsProduce: {
                    required: 'Specify Number of Food Product Units',
                    number: 'Must be a number',
                },
            },
            submitHandler() { component.handleSubmit(); },
        });
    }

    renderFormulas() {
        let items = [];
        items.push(<option key={-1} disabled selected value='undefined'> -- select a formula -- </option>)
        j = 0
        for (let i = 0; i < this.props.formulas.length; i++) {
            items.push(<option key={j} value={this.props.formulas[i]._id}>{this.props.formulas[i].name}</option>);
            j++
        }
        items.push(<option key={-2} disabled value> -- select an intermediate -- </option>)
        for (i = 0; i < this.props.intermediates.length; i++) {
            items.push(<option key={j} value={this.props.intermediates[i]._id}>{this.props.intermediates[i].name}</option>);
            j++
        }

        return items;
    }

    renderMinFormulaUnits() {
        return (
            <p><b>Minimum Units of Production: </b>{this.state.minUnits}</p>
        )
    }

    renderStockDifferenceHeaders() {
        return (
            <div>
                <p><b>Ingredient / Intermediate Consumption: </b></p>
                <div className="side-container-zero">
                    <div className="side-spacingInput">
                        <b>Item</b>
                    </div>
                    <div className="side-spacingInput">
                        <b>Type</b>
                    </div>

                    <div className="side-spacingInput">
                        <b>Native Units To Be Used</b>
                    </div>

                    <div className="side-spacingInput">
                        <b>Current Stock</b>
                    </div>

                    <div className="side-spacingInput">
                        <b>Stock After Production</b>
                    </div>
                    <div className="side-spacingInput">
                        <b></b>
                    </div>
                </div>
            </div>
        )
    }

    setFormulaInfo = () => {
  
        if (this.formula.value != 'undefined') {

            let formulaID = this.formula.value
            let formula = null
            let numUnitsProduce = Number(this.numUnitsProduce.value)

            for (let i = 0; i < this.props.formulas.length; i++) {
                if (formulaID == this.props.formulas[i]._id) {
                    formula = this.props.formulas[i]
                }
            }

            for (let i = 0; i < this.props.intermediates.length; i++) {
                if (formulaID == this.props.intermediates[i]._id) {
                    formula = this.props.intermediates[i]
                }
            }

            let stockDifference = []
            let ingList = []
            let unitsMultiplier = formula != null ? Number(numUnitsProduce) / Number(formula.productUnits) : 0

            for (let i = 0; i < formula.ingredientsList.length; i++) {

                stockDifference.push(<ProductionRunItem
                    key={i}
                    index={i}
                    ingredient={formula.ingredientsList[i]}
                    unitsMultiplier={unitsMultiplier}
                    onChange={this.onChangeItem.bind(this)}
                />)
                ingList.push({
                    ingredient: null
                })

            }

            this.setState({
                ingList: ingList,
                minUnits: Number(formula.productUnits),
                stockDifference: stockDifference,
                numUnitsToProduce: Number(numUnitsProduce)
            })
        }
    }

    onChangeItem(index, component) {

        let ingList = this.state.ingList

        ingList[index].ingredient = component

        this.setState({
            ingList: ingList,
        })
    }

    addToCart = () => {
        console.log("adding to cart")

        const { history } = this.props.hist;

        let ingList = this.state.ingList
        let ingListArray = []
        
        for (let i = 0; i < ingList.length; i++) {
            let state = ingList[i].ingredient.state
            let ingredient = ingList[i].ingredient.props.ingredient

            ingListArray.push({
                ingredient: ingredient.id,
                newStock: state.stockAfterProduction,
                notEnough: state.notEnough
            })
        }

        console.log(ingListArray)

        Meteor.call('production.addToCart',
            ingListArray,
            function (error, result) {
                if (error) {
                    Bert.alert(error.reason, 'danger')
                } else {
                    Bert.alert("Added Missing Ingredients To Cart", 'success')
                    history.push('/cart')
                }
            })
    }

    goToCart = () => {
        const { history } = this.props
        history.push('/cart')

    }


    handleSubmit() {
        
        const { history } = this.props

        let formulaID = this.formula.value
        let formula = null

        let ingList = this.state.ingList
        let numUnitsProduce = Number(this.numUnitsProduce.value)
        let ingListArray = []

        for (let i = 0; i < ingList.length; i++) {
            let state = ingList[i].ingredient.state
            let ingredient = ingList[i].ingredient.props.ingredient

            ingListArray.push({
                ingredient: ingredient.id,
                newStock: state.stockAfterProduction,
                notEnough: state.notEnough
            })
        }

        Meteor.call('production.produce',
            formulaID,
            numUnitsProduce,
            ingListArray,
            function (error, result) {
                if (error) {
                    Bert.alert(error.reason, 'danger')
                } else {
                    Bert.alert("Successfully Produced Formula!", 'success')
                    document.getElementById("form").reset();
                    document.getElementById("input").value = "";
                    document.getElementById("select").value = 'undefined';
                    this.setState({
                        ingList: [],
                        minUnits: Number(0),
                        numUnitsToProduce: Number(0),
                        stockDifference: null,
                        notEnough: false
                    })
                }
            }.bind(this))

    }

    render() {

        return (
            <div>

                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

                    <FormGroup>
                        <ControlLabel>Formula To Make:</ControlLabel>
                        <p>
                            <select
                                ref={formula => (this.formula = formula)}
                                name="formula"
                                //style={{ width: '100%', height: '100%' }}
                                onChange={this.setFormulaInfo}
                                id='select'
                            >
                                {this.renderFormulas()}
                            </select></p>
                    </FormGroup>

                    {this.renderMinFormulaUnits()}

                    <FormGroup>
                        <ControlLabel>Number Of Units to Produce:</ControlLabel>
                        <p><input
                            type="number"
                            step="1"
                            ref={numUnitsProduce => (this.numUnitsProduce = numUnitsProduce)}
                            onChange={this.setFormulaInfo}
                            //defaultValue={this.state.minUnits}
                            name="numUnitsProduce"
                            placeholder={this.state.minUnits}
                            className="form-control"
                            id='input'
                        /></p>
                    </FormGroup>

                    {this.renderStockDifferenceHeaders()}

                    {this.state.stockDifference}

                    <p></p>

                    <ButtonToolbar>
                        <Button type="submit" bsStyle="success"
                        >
                            Produce
                        </Button>

                        <Button
                            bsStyle="danger"
                            onClick={this.addToCart}>
                            Add Missing Ingredients To Cart (if applicable)
                        </Button>

                        {/* <Button
                            bsStyle="warning" 
                            onClick={this.goToCart}
                        >
                            Go To Cart
                        </Button> */}


                    </ButtonToolbar>
                </form>

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('formulas');
    Meteor.subscribe('vendors');
    Meteor.subscribe('intermediates')
    return {
        formulas: Formulas.find({}).fetch(),
        vendors: Vendors.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch(),
    };
})(ProductionRun);





