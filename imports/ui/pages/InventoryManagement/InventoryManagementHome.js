import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'
import Carts from '../../../api/Cart/Cart.js';
import IngredientsList from '../../../api/Ingredients/IngredientList.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { withTracker } from 'meteor/react-meteor-data';

class InventoryManagementHome extends Component {
  constructor(props) {
    super(props);  
}

  render() {
    return (
      <div className="container">
        <header>
            <h1>Inventory Management</h1>
        </header>
        
        <InventoryManagementNavBar hist = {this.props}/>

      </div>
    );
  }
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	Meteor.subscribe('vendors')
	Meteor.subscribe('carts');
	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
		carts: Carts.find({}).fetch(),
	};
})(InventoryManagementHome);