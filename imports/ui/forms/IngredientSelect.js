import React, { Component, PropTypes } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import  IngredientList  from '../../api/Ingredients/IngredientList.js'

export class IngredientSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nativeUnit: "",
      ingredient: ""
		};
  }

  renderOptions() {
    let items = [];
    for (i = 0; i < this.props.ingredients.length; i++) {
        items.push(<option key={i} value={this.props.ingredients[i]._id }>{this.props.ingredients[i].name}</option>);
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
      nativeUnit: existingIng.nativeInfo.nativeUnit,
      ingredient: existingIng.name,
    });
  }

  render() {
    return (
        <select
         ref={ingredient => (this.ingredient = ingredient)}
         name="ingredient"
         style={{ width: '100%', height: '100%'}}
         onChange={this.sendInfo}
         >
        <option disabled selected value> -- select an ingredient -- </option>
         {this.renderOptions()}
        </select>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('ingredients');
  return {
      ingredients: IngredientsList.find({}).fetch()
  };
})(IngredientSelect);