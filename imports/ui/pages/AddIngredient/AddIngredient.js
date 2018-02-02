import React, { Component } from 'react';
import { Link , BrowserRouter} from 'react-router-dom';
import IngredientForm from '../../forms/IngredientForm.js'
 
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
        
        <IngredientForm hist = {this.props}/>
          
      </div>
    );
  }
}

export default AddIngredient;





