import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientSelect from '../../forms/IngredientSelect.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Intermediates } from '../../../api/Intermediates/intermediates'

class FormulaIngredientInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ingredient: null,
            nativeUnit: null,
            quantity: Number(0)
        };

    }

    renderOptions() {
        let items = [];
        let j = 0

        let defaultFormula = this.props.defaultFormula != undefined ? this.props.defaultFormula._id : '0'

        for (i = 0; i < this.props.ingredients.length; i++) {
            items.push(<option key={j} value={this.props.ingredients[i]._id}>{this.props.ingredients[i].name}</option>);
            j++
        }
        j++
        items.push(<option disabled value> -- select an intermediate -- </option>)
        for (i = 0; i < this.props.intermediates.length; i++) {
            if (defaultFormula != this.props.intermediates[i]._id){
                items.push(<option key={j} value={this.props.intermediates[i]._id}>{this.props.intermediates[i].name}</option>);
                j++
            }
        }
        return items;
    }



    setIngredientInfo = (event, key) => {

        let existingIng;

        for (i = 0; i < this.props.ingredients.length; i++) {
            if (this.ingredient.value == this.props.ingredients[i]._id) {
                existingIng = this.props.ingredients[i]
            }
        }

        for (i = 0; i < this.props.intermediates.length; i++) {
            if (this.ingredient.value == this.props.intermediates[i]._id) {
                existingIng = this.props.intermediates[i]
            }
        }

        this.setState({
            ingredient: existingIng._id,
            nativeUnit: existingIng.nativeInfo.nativeUnit,
        });

        this.props.onChange(this.props.index, this, true);
    }

    setQuantity = (event, key) => {
        
        var quantity = event.target.value;

        this.setState({
            quantity: Number(quantity)
        })

        this.props.onChange(this.props.index, this, true);
    }

    delete = (event, key) => {

        this.props.onChange(this.props.index, this, false);
    }

    render() {
        /**
         * Ingredient Select
         * Quantity
         * Submit?
         * Delete
         */
        return (

            <div className="side-container-zero">

                <div className="side-spacingInput">
                    <select
                        ref={ingredient => (this.ingredient = ingredient)}
                        name="ingredient"
                        style={{ width: '100%', height: '100%' }}
                        onChange={this.setIngredientInfo}
                    >
                        <option disabled selected value> -- select an ingredient -- </option>
                        {this.renderOptions()}
                        
                     
                    </select>
                </div>

                <div className="side-spacing">
                    <input
                        type="number"
                        ref={numUnits => (this.numUnits = numUnits)}
                        name="numUnits"
                        placeholder="# of Units"
                        onChange={this.setQuantity}
                        className="form-control"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <div className="nativeUnit">
                    <div className="nativeUnitPad">
                        {this.state.nativeUnit}
                    </div>
                </div>

                <div className="side-spacing">
                    <Button
                        bsStyle="danger"
                        bsSize="small"
                        onClick={this.delete}
                    >
                    Delete
                </Button>
                </div>
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('ingredients');
    Meteor.subscribe('intermediates')
    return {
        ingredients: IngredientsList.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch()
    };
})(FormulaIngredientInput);
