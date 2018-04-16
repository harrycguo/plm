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
import { ProductionLines } from '../../../api/ProductionLines/productionLines.js'


class ProductionRun extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ingList: [],
            minUnits: Number(0),
            numUnitsToProduce: Number(0),
            stockDifference: null,
            notEnough: false,
            productionLineInputs: <option key={-1} disabled selected value='undefined'> -- select a production line -- </option>
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
                productionLine: {
                    required: true,
                }

            },
            messages: {
                formula: {
                    required: 'Specify Formula',
                },
                numUnitsProduce: {
                    required: 'Specify Number of Food Product Units',
                    number: 'Must be a number',
                },
                productionLine: {
                    required: 'Specify Production Line',
                },
            },
            submitHandler() { component.handleSubmit(); },
        });
    }

    renderFormulas() {
        let items = [];
        let j = 0
        items.push(<option key={j} disabled selected value='undefined'> -- select a final product -- </option>)
        j++
        for (let i = 0; i < this.props.formulas.length; i++) {
            items.push(<option key={j} value={this.props.formulas[i]._id}>{this.props.formulas[i].name}</option>);
            j++
        }
        j++
        items.push(<option key={j} disabled value> -- select an intermediate -- </option>)
        j++
        for (i = 0; i < this.props.intermediates.length; i++) {
            items.push(<option key={j} value={this.props.intermediates[i]._id}>{this.props.intermediates[i].name}</option>);
            j++
        }

        return items;
    }

    renderProductionLines() {
        let items = []
        let lines = this.props.productionLines

        if (this.formula == undefined){
            items.push(<option key={-1} disabled selected value='undefined'> -- select a production line -- </option>)
        } else {
            let formulaID = this.formula.value

            for (let i = 0; i < lines.length; i++){
                let formulaList = lines[i].formulasList
                if (formulaList.includes(formulaID)){
                    items.push(<option key={i} value={lines[i]._id}>{lines[i].name}</option>);
                }
            }
        }

        return items
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

            let items = []
            let lines = this.props.productionLines
          
            items.push(<option key={-1} disabled selected value='none'> -- select a production line -- </option>)

            for (let i = 0; i < lines.length; i++){
                let formulaList = lines[i].formulasList

                if (!lines[i].busy) {
                    for (let j = 0; j < formulaList.length; j++){
                        if (formulaList[j].id == formulaID){
                            items.push(<option key={i} value={lines[i]._id}>{lines[i].name}</option>)
                        }
                    }
                }
            }

            if (items.length == 1){
                Bert.alert("Error: No Production Lines currently available to make this formula. Free compatible line or add line compatibility", 'danger')
            }

            this.setState({
                ingList: ingList,
                minUnits: Number(formula.productUnits),
                stockDifference: stockDifference,
                numUnitsToProduce: Number(numUnitsProduce),
                productionLineInputs: items
            })
        }
    }



    onChangeItem(index, component) {
   
        let ingList = this.state.ingList
        ingList[index].ingredient = component
      
        let notEnough = false

        for (let i = 0; i < ingList.length; i++){
            if (ingList[i].ingredient != null) {
                if (ingList[i].ingredient.state != null) {
                    if (ingList[i].ingredient.state.notEnough) {
                        notEnough = true
                        break
                    }
                }
            }                 
        }

        if (component != null) {
            if (component.state != null) {
                if (component.state.notEnough) {
                    notEnough = true
                }
            }
        }

        if (this.numUnitsProduce.value == ''){
            notEnough = false
        }

        this.setState({
            ingList: ingList,
            notEnough: notEnough
        })
    }

    addToCart = () => {

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
        let productionLineID = this.productionLine.value
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

        Meteor.call('production.initialize',
            formulaID,
            numUnitsProduce,
            ingListArray,
            productionLineID,
            function (error, result) {
                if (error) {
                    Bert.alert(error.reason, 'danger')
                } else {
                    Bert.alert("Successfully started Formula Production!", 'success')
                    document.getElementById("form").reset();
                    document.getElementById("input").value = "";
                    document.getElementById("select").value = 'undefined';
                    document.getElementById("productionLine").value = 'none';
                    this.setState({
                        ingList: [],
                        minUnits: Number(0),
                        numUnitsToProduce: Number(0),
                        stockDifference: null,
                        notEnough: false,
                        productionLineInputs: <option key={-1} disabled selected value='undefined'> -- select a production line -- </option>
                    })
                }
            }.bind(this))

    }

    render() {

        let button = true ? <Button
        bsStyle="danger"
        onClick={this.addToCart}>
        Add Missing Ingredients To Cart (if applicable)
        </Button>
        : null

        return (
            <div>

                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

                    <FormGroup>
                        <ControlLabel>Formula To Make:</ControlLabel>
                        <p>
                            <select
                                ref={formula => (this.formula = formula)}
                                name="formula"
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
                            name="numUnitsProduce"
                            placeholder={this.state.minUnits}
                            className="form-control"
                            id='input'
                        /></p>
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Production Line (Compatible and Free):</ControlLabel>
                        <p>
                            <select
                                name="productionLine"
                                ref={productionLine => (this.productionLine = productionLine)}
                                id='productionLine'
                            >
                                {this.state.productionLineInputs}
                            </select>
                        </p>
                    </FormGroup>

                    {this.renderStockDifferenceHeaders()}

                    {this.state.stockDifference}
                    
                    <p></p>

                    <ButtonToolbar>
                        <Button type="submit" bsStyle="success"
                        >
                            Produce
                        </Button>

                        {button}

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
    Meteor.subscribe('productionLines')
    return {
        formulas: Formulas.find({}).fetch(),
        vendors: Vendors.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch(),
        productionLines: ProductionLines.find({}).fetch(),
    };
})(ProductionRun);





