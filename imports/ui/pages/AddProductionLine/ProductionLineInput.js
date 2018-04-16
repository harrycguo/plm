import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientSelect from '../../forms/IngredientSelect.js'
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import Formulas from '../../../api/Formulas/formulas.js'

class ProductionLineInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formula: null,
        };

    }

    renderOptions() {
        let items = [];
        let j = 0

        let defaultFormula = this.props.defaultFormula != undefined ? this.props.defaultFormula : '0'

        items.push(<option key={j} disabled value selected> -- select a final product -- </option>)
        j++
        for (i = 0; i < this.props.formulas.length; i++) {
            if (defaultFormula != this.props.formulas[i]._id){
                items.push(<option key={j} value={this.props.formulas[i]._id}>{this.props.formulas[i].name}</option>);
            } else {
                items.push(<option key={j} selected value={this.props.formulas[i]._id}>{this.props.formulas[i].name}</option>);
            }
            j++
        }
        j++
        items.push(<option disabled value> -- select an intermediate -- </option>)
        j++
        for (i = 0; i < this.props.intermediates.length; i++) {
            if (defaultFormula != this.props.intermediates[i]._id){
                items.push(<option key={j} value={this.props.intermediates[i]._id}>{this.props.intermediates[i].name}</option>);
            } else {
                items.push(<option key={j} selected value={this.props.intermediates[i]._id}>{this.props.intermediates[i].name}</option>);
            }
            j++
        }

        
       
        return items;
    }



    setFormulaInfo = (event, key) => {

        let existingFormula;

        for (i = 0; i < this.props.formulas.length; i++) {
            if (this.formula.value == this.props.formulas[i]._id) {
                existingFormula = this.props.formulas[i]
            }
        }

        for (i = 0; i < this.props.intermediates.length; i++) {
            if (this.formula.value == this.props.intermediates[i]._id) {
                existingFormula = this.props.intermediates[i]
            }
        }

        this.setState({
            formula: existingFormula._id,
        });

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
                        ref={formula => (this.formula = formula)}
                        name="ingredient"
                        style={{ width: '100%', height: '100%' }}
                        onChange={this.setFormulaInfo}
                    >
                        {this.renderOptions()}
                    </select>
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
    Meteor.subscribe('formulas')
    return {
        intermediates: Intermediates.find({}).fetch(),
        formulas: Formulas.find({}).fetch()
    };
})(ProductionLineInput);
