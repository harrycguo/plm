import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IngredientForm from '../../forms/IngredientForm.js'
 
// App component - represents the whole app
class AddIngredient extends Component {
  constructor(props) {
    super(props);
    console.log("User = ")
    console.log(Meteor.user());
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Add Ingredient</h1>
        </header>
        
        <IngredientForm/>
          
      </div>
    );
  }
}

export default AddIngredient;





