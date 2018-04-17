import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Intermediates } from '../../../api/Intermediates/intermediates' 
import { ProductionLines } from '../../../api/ProductionLines/productionLines.js'


class ViewFormula extends Component {
    constructor(props) {
        super(props);
    }

    renderIngredientsList() {

        let ingMap = new Map();
        let intMap = new Map();

        for (let i = 0; i < this.props.ingredients.length; i++) {
            ingMap.set(this.props.ingredients[i]._id, this.props.ingredients[i])
        }
        for (let i = 0; i < this.props.intermediates.length; i++) {
            intMap.set(this.props.intermediates[i]._id, this.props.intermediates[i])
        }


        let ingList = []

        let formula = this.props.location.state.formula

        for (let i = 0; i < formula.ingredientsList.length; i++) {

            if (ingMap.get(formula.ingredientsList[i].id) != undefined) {
                ingList.push(
                    <div key={`scz${i}`} className="side-container-zero">
                        <div key={`scz1${i}`} className="side-spacingInput">
                            {ingMap.get(formula.ingredientsList[i].id).name}
                        </div>

                        <div key={`scz2${i}`} className="side-spacingInput">
                            {formula.ingredientsList[i].amount}
                        </div>
                    </div>
                )
            }

            else if (intMap.get(formula.ingredientsList[i].id) != undefined) {
                ingList.push(
                    <div key={`scz${i}`} className="side-container-zero">
                        <div key={`scz1${i}`} className="side-spacingInput">
                            {intMap.get(formula.ingredientsList[i].id).name}
                        </div>

                        <div key={`scz2${i}`} className="side-spacingInput">
                            {formula.ingredientsList[i].amount}
                        </div>
                    </div>
                )
            }
        }
        return ingList
    }


    renderHeaders() {
        return (
            <div>
                <p><b>Ingredients List: </b></p>
                <div className="side-container-zero">
                    <div className="side-spacingInput">
                        <b>Ingredient</b>
                    </div>

                    <div className="side-spacingInput">
                        <b>Native Units To Be Used</b>
                    </div>

                </div>
            </div>
        )
    }

    renderProductionLines() {
        let items = []
        let lines = this.props.productionLines
        let formulaID = this.props.location.state.formula._id

        for (let i = 0; i < lines.length; i++){
            let formulaList = lines[i].formulasList

                for (let j = 0; j < formulaList.length; j++){
                    if (formulaList[j].id == formulaID){
                        items.push(<div key={i}>{lines[i].name}</div>)
                    }
                }
            
        }

        if (items.length == 0){
            return <p>(none)</p>
        }
        
        return items
    }


    render() {

        let text = null

        let user = Meteor.user() 
        if (Roles.userIsInRole(user, ['admin', 'manager'])) {
            text = '*To Modify Compatible Production Lines, please go to Production Line Management'
        }

        return (
            <div className="container">
                <header>
                    <h1>View Formula</h1>
                </header>
                <h2>{this.props.location.state.formula.name}</h2>
                <hr className="divider"></hr>
                <p></p>
                <p> <b>Formula Name:</b> {this.props.location.state.formula.name}</p>
                <p> <b>Description:</b> {this.props.location.state.formula.description}</p>
                <p> <b>Product Units:</b> {this.props.location.state.formula.productUnits}</p>
                <p></p>

                {this.renderHeaders()}

                {this.renderIngredientsList()}
                <p></p>
                <p><b>Compatible Production Lines:</b></p>
                {this.renderProductionLines()}
                <br></br>
              
               <p>{text}</p>

                <p></p>
                <hr className='divider'></hr>
            <p></p>
				<p><Link to='/formulaManagement'>Return to Formula Management</Link></p>

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    Meteor.subscribe('productionLines');
    return {
        ingredients: IngredientsList.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch(),
        productionLines: ProductionLines.find({}).fetch(),
    };
})(ViewFormula);





