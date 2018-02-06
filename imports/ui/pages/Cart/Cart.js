import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';


class IngredientCart extends Component {
	
	remove() {
		console.log(this)
	}

	renderCartItems() {
		// 	return this.props.carts.ingredients.map(ingredient => (
		// 		<tr>
		// 			<td>ingredient.ingredient</td>
		// 			<td>ingredient.amount</td>
		// 			<td><button
		// 				onClick={this.remove.bind(this)}
		// 				title= "Edit"
		// 				>Remove From Cart</button>
		// 			</td>
		// 	</tr>
		// 	));
		// }
		console.log(this.props)
		console.log(Carts)
		return null
	}

	render() {
		return (
			<div style={{ padding: "5px" }}>
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
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('carts')
	return {
		carts: Carts.find({"user._id" : Meteor.userId()}).fetch()
	};
})(IngredientCart);
