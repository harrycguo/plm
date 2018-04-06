import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsApi from '../../../api/Ingredients/IngredientsApi.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import { Button , Label} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Timer from '../Cart/Timer.js'
import PendingOrderItem from './PendingOrderItem'

class PendingOrders extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			totalCost: Number(0),
		}
	}

	renderPendingOrderItems() {

		var frontEndCart = Array()
		var keyCount = 0
		var totalCost = 0

		this.props.carts.forEach(function(cart) {
			cart.pendingOrders.forEach(function(ing) {
				
                    frontEndCart.push(
                        {key: keyCount, fullIng: ing, amt: ing.numPackages}
                    )
                    keyCount++
                
				
			})
		});

		frontEndCart.map(ingredient => (
			totalCost+= Number(ingredient.fullIng.vendorInfo.price * ingredient.fullIng.numPackages)
		))

		return frontEndCart.length > 0 ? frontEndCart.map(ingredient => (			
            <PendingOrderItem key={ingredient.key} ingredient={ingredient} />
		)) : null;
	}

	checkoutButton() {
		const { history } = this.props
		return (<Button
				bsStyle="success"
				onClick={e => {
					Meteor.call('pendingOrders.addToInventory', function(error, result) {
						if(error){
                   			console.log("something goes wrong with the following error message " + error.reason )
               	  			Bert.alert(error.reason, 'danger');
                		} else {
							Bert.alert('Successfully Updated Pending Orders', 'success');
						}
					});
				}}
				title="Checkout"
				>Update Pending Orders</Button>
		);
	}

	render() {		

		var frontEndCart = Array()
		var keyCount = 0
		var totalCost = 0

		this.props.carts.forEach(function(cart) {
			cart.pendingOrders.forEach(function(ing) {
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
			<div>
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
							<th>Order Status</th>
						</tr>
	    				{this.renderPendingOrderItems()}
	    			</tbody>
	       		</table>
				   
				   
				   <p></p>
				   <Timer />
				   {this.checkoutButton()}

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
})(PendingOrders);
