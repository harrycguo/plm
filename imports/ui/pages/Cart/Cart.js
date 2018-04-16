import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsApi from '../../../api/Ingredients/IngredientsApi.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { Button , Label} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CartItem from './CartItem.js'
import Timer from './Timer.js'

class Cart extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			totalCost: Number(0),
		}
	}

	renderCartItems() {

		var frontEndCart = Array()
		var keyCount = 0

		this.props.carts.forEach(function(ingredients) {
			ingredients.ingredients.forEach(function(ing) {
			
					frontEndCart.push(
						{key: keyCount, fullIng: ing, amt: ing.numPackages}
					)
					keyCount++;
				
			})
		});


		return frontEndCart.length > 0 ? frontEndCart.map(ingredient => (			
			<CartItem key={ingredient.key} ingredient={ingredient} />
		)) : null;
	}

	checkoutButton() {
		const { history } = this.props
		return (<Button
				bsStyle="success"
				onClick={e => {
					Meteor.call('cart.checkout', function(error, result) {
						if(error){
               	  			Bert.alert(error.reason, 'danger');
                		} else {
							Bert.alert('Successfully Checked Out!', 'success');
						}
					});
				}}
				title="Checkout"
				>Checkout Cart</Button>
		);
	}

	render() {		

		var frontEndCart = Array()
		var keyCount = 0
		var totalCost = 0

		this.props.carts.forEach(function(ingredients) {
			ingredients.ingredients.forEach(function(ing) {
				
					frontEndCart.push(
						{key: keyCount, fullIng: ing, amt: ing.numPackages}
					)
					keyCount++;
				
			})
		});

		frontEndCart.map(ingredient => (
			totalCost+= Number(ingredient.fullIng.vendorInfo.price * ingredient.fullIng.numPackages)
		))

		return (
			<div className="container">

			<header>
          		<h1>Cart</h1>
        	</header>
			<p></p>
		    	<table>
		    		<tbody>
		    			<tr>
		    				<th>Ingredient</th>
		    				<th>Packages</th>
		    				<th>Qty. per Package</th>
		    				<th>Vendor</th>
		    				<th>Price per Package</th>
							<th>Total Quantity</th>
							<th>Total Price</th>
						</tr>
	    				{this.renderCartItems()}
	    			</tbody>
	       		</table>
				   
				   <p></p>
				   <p><b>Total Cost: </b> ${totalCost.toFixed(2)}</p>
				   <p></p>
				   {this.checkoutButton()}
					<p></p>
				   <hr className='divider'></hr>
          			<p></p>

				   <div className="container-keepLeft">
                    <Link to='/inventoryManagement'>Return to Inventory Management</Link>
                </div>
				<div className="container-keepLeft">
                    <Link to='/formulaManagement'>Return to Formula Management</Link>
                </div>
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('carts')
	Meteor.subscribe('vendors')
	Meteor.subscribe('ingredients')

	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
		carts: Carts.find({"user" : Meteor.userId()}).fetch()
	};
})(Cart);
