import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Intermediates } from '../../../api/Intermediates/intermediates' 

class ViewIntermediate extends Component {
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

    render() {
        
        let tempState = this.props.location.state.formula.temperatureState.charAt(0).toUpperCase().concat(this.props.location.state.formula.temperatureState.substr(1))
        let packaging = this.props.location.state.formula.packageInfo.packageType.charAt(0).toUpperCase().concat(this.props.location.state.formula.packageInfo.packageType.substr(1))


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
                <p> <b>Temperature State:</b> {tempState}</p>
                <p> <b>Packaging:</b> {packaging}</p>
                <p> <b>Number of Native Units Per Package:</b> {this.props.location.state.formula.nativeInfo.numNativeUnitsPerPackage}</p>
                <p> <b>Native Units:</b> {this.props.location.state.formula.nativeInfo.nativeUnit}</p>
                <p></p>

                {this.renderHeaders()}

                {this.renderIngredientsList()}

                <p></p>
				<p><Link to='/formulaManagement'>Return to Formula Management</Link></p>

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('ingredients');
    Meteor.subscribe('intermediates')
    return {
        ingredients: IngredientsList.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch()
    };
})(ViewIntermediate);





