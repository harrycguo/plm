import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom'
import { Row, Col, Container, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class ProductionRunItem extends Component {
  constructor(props) {
    super(props);
  }

componentWillMount() {
    for (i = 0; i < this.props.ingredients.length; i++) {
        if (this.props.ingredients[i]._id == this.props.ingredient.id) {

            let usage = Number(this.props.ingredient.amount) * Number(this.props.unitsMultiplier)
            let newStock = Number(this.props.ingredients[i].nativeInfo.totalQuantity) - usage

            this.setState({
                ingredientName: this.props.ingredients[i].name,
                amountToBeUsed: usage,
                currenStock: Number(this.props.ingredients[i].nativeInfo.totalQuantity),
                stockAfterProduction: newStock,
                notEnough: newStock < 0 ? true: false
            });
        }
    }

    this.props.onChange(this.props.index, this)
}

componentWillReceiveProps(nextProps){
  
    for (i = 0; i < nextProps.ingredients.length; i++) {
      if (nextProps.ingredients[i]._id == nextProps.ingredient.id) {

        let usage = Number(nextProps.ingredient.amount) * Number(nextProps.unitsMultiplier)
        let newStock = Number(nextProps.ingredients[i].nativeInfo.totalQuantity) - usage

          this.setState({
              ingredientName: nextProps.ingredients[i].name,
              amountToBeUsed: usage,
              currenStock: Number(nextProps.ingredients[i].nativeInfo.totalQuantity),
              stockAfterProduction: newStock,
              notEnough: newStock < 0 ? true: false
          });
      }
    }

    this.props.onChange(this.props.index, this)
}



  render() {

    let notEnoughError = this.state.notEnough ? <div className="redFont">Error: Not Enough In Stock!</div> : <div></div>
    
    return (     
      <div>
            <div className="side-container-zero">
                <div className="side-spacingInput">
                    {this.state.ingredientName}
                </div>

                <div className="side-spacingInput">
                  {this.state.amountToBeUsed}
                </div>

                <div className="side-spacingInput">
                  {this.state.currenStock}
                </div>

                <div className="side-spacingInput">
                  {this.state.stockAfterProduction}
                </div>

                <div className="side-spacingInput">
                  {notEnoughError}
                </div>


            </div>
        </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('ingredients');
  return {
      ingredients: IngredientsList.find({}).fetch()
  };
})(ProductionRunItem);