import React, { Component } from 'react';
import { Link , BrowserRouter} from 'react-router-dom';
import IngredientForm from '../../forms/IngredientForm.js'
import AdminViewInventoryNavBar from '../../components/AdminViewInventoryNavBar/AdminViewInventoryNavBar.js'

 
class AddIngredient extends Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    
    return (
      <div className="container">
        <header>
          <h1>Add Ingredient</h1>
        </header>
        <AdminViewInventoryNavBar/>
        <IngredientForm hist = {this.props}/>
          
      </div>
    );
  }
}

export default AddIngredient;





