import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientSelect from '../../forms/IngredientSelect.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class FormulaIngredientInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ingredient: "",
            nativeUnit: "",
            quantity: Number(0)
        };

    }

    renderOptions() {
        let items = [];
        for (i = 0; i < this.props.ingredients.length; i++) {
            items.push(<option key={i} value={this.props.ingredients[i]._id}>{this.props.ingredients[i].name}</option>);
        }
        return items;
    }

    sendInfo = () => {

        let existingIng;

        for (i = 0; i < this.props.ingredients.length; i++) {
            if (this.ingredient.value == this.props.ingredients[i]._id) {
                existingIng = this.props.ingredients[i]
            }
        }

        this.setState({
            ingredient: existingIng,
            nativeUnit: existingIng.nativeInfo.nativeUnit,
        });
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

                <div className="side-spacing">
                    <select
                        ref={ingredient => (this.ingredient = ingredient)}
                        name="ingredient"
                        style={{ width: '100%', height: '100%' }}
                        onChange={this.sendInfo}
                    >
                        <option disabled selected value> -- select an ingredient -- </option>
                        {this.renderOptions()}
                    </select>
                </div>

                <div className="side-spacing">
                    <input
                        type="number"
                        step="1"
                        ref={numUnits => (this.numUnits = numUnits)}
                        name="numUnits"
                        placeholder="# of Units"
                        //onChange
                        className="form-control"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <div className="side-spacing">
                    <p>{this.state.nativeUnit}</p>
                </div>

                <div className="side-spacing">
                    <Button
                        bsStyle="danger"
                        bsSize="small"
                    //onClick={this.add}
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
})(FormulaIngredientInput);
