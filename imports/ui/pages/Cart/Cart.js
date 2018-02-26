import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import { Link } from 'react-router-dom';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'


class IngredientCart extends Component {
	
	remove() {
		console.log(this.fullIng)
		Meteor.call('removeIngredientFromCart', this.fullIng.ingredient,
			function(error, result){
				if(error){
                   	console.log("something goes wrong with the following error message " + error.reason )
               	  	Bert.alert(error.reason, 'danger');
                }
			}
		);
	}

	renderCartItems() {
		var frontEndCart = Array()
		var keyCount = 0;
		this.props.carts.forEach(function(ingredients) {
			ingredients.ingredients.forEach(function(ing) {
				frontEndCart.push(
					{key: keyCount, fullIng: ing, amt: ing.amount}
				)
				keyCount++;
				console.log(ing)
			})
		});
		return frontEndCart.map(ingredient => (
			<tr key={ingredient.key}>
				<td>{ingredient.fullIng.ingredient.name}</td>
				<td>{ingredient.amt}</td>
				<td>
					<button
					onClick={this.remove.bind(ingredient)}
					title= "Edit">
						Remove From Cart
					</button>
				</td>
			</tr>
		))
	}

	checkoutButton() {

		const {history} = this.props

		let user = Meteor.user();
		let returnLink = null;
		
		if (Roles.userIsInRole(user, ['admin'])) {
			returnLink = '/inventoryManagement'
		} else {
			returnLink = '/inventoryManagement'
		}

		return (<button
				onClick={e => {
					Meteor.call('checkoutIngredients', function(error, result) {
						if(error){
                   			console.log("something goes wrong with the following error message " + error.reason )
               	  			Bert.alert(error.reason, 'danger');
                		} else {
							Bert.alert('Successfully Checked Out!', 'success');
							history.push(returnLink)
							
							}
					});
				}}
				title="Checkout"
				>Checkout Cart</button>
		);
	}

	render() {
		return (
			<div className="container">

			<header>
          		<h1>Cart</h1>
        	</header>
			<InventoryManagementNavBar/>
		
			
		    	<table>
		    		<tbody>
		    			<tr>
		    				<th>Ingredient</th>
		    				<th>Amount</th>
		    				<th>Remove</th>
						</tr>
	    				{this.renderCartItems()}
	    			</tbody>
	       		</table>
	       		{this.checkoutButton()}
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('carts')
	return {
		carts: Carts.find({"user" : Meteor.userId()}).fetch()
	};
})(IngredientCart);
