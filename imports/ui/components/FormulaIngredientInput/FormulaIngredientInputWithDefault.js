import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientSelect from '../../forms/IngredientSelect.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class FormulaIngredientInputWithDefault extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ingredient: this.props.defaultIngredient,
            quantity: this.props.defaultQuantity,
            oldNativeUnit: true,
            oldIng: true
        };
    
    }

    componentWillMount() {
        for (i = 0; i < this.props.ingredients.length; i++) {
            if (this.props.ingredients[i]._id == this.props.defaultIngredient) {
                this.setState({
                    ingredient: this.props.ingredients[i]._id,
                    nativeUnit: this.props.ingredients[i].nativeInfo.nativeUnit,
                });
            }
        }
    }

    renderNativeUnit() {
        let nativeUnit = "";

        for (i = 0; i < this.props.ingredients.length; i++) {
            if (this.props.ingredients[i]._id == this.props.defaultIngredient) {
                nativeUnit = this.props.ingredients[i].nativeInfo.nativeUnit
            }
        }
        return nativeUnit
    }

    renderOptions() {
        let items = [];
        for (i = 0; i < this.props.ingredients.length; i++) {
            
            if (this.props.ingredients[i]._id == this.props.defaultIngredient) {

                items.push(<option selected key={i} value={this.props.ingredients[i]._id}>{this.props.ingredients[i].name}</option>);
            } else {
                items.push(<option key={i} value={this.props.ingredients[i]._id}>{this.props.ingredients[i].name}</option>);
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

        this.setState({
            oldNativeUnit: false,
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

        let nativeUnit = this.state.oldNativeUnit ? this.renderNativeUnit() : this.state.nativeUnit
            
        return (

            

            <div className="side-container-zero">

                <div className="side-spacing">
                    <select
                        ref={ingredient => (this.ingredient = ingredient)}
                        name="ingredient"
                        style={{ width: '100%', height: '100%' }}
                        onChange={this.setIngredientInfo}
                    >
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
                        defaultValue={this.props.defaultQuantity}
                        className="form-control"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <div className="side-spacing">
                    <p>{nativeUnit}</p>
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
    return {
        ingredients: IngredientsList.find({}).fetch()
    };
})(FormulaIngredientInputWithDefault);
