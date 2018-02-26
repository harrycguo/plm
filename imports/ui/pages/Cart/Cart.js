import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsApi from '../../../api/Ingredients/IngredientsApi.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
import EditVendor from '../../table/EditVendor.js';
import { Button } from 'react-bootstrap';


import { Link } from 'react-router-dom';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'


class IngredientCart extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			edit: props.edit
		}
	}

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
		var vendorMap = new Map();
		var ingMap = new Map();

		this.props.ingredients.forEach(function(ing) {
			ingMap.set(ing._id, ing);
		});

		this.props.vendors.forEach(function (vend) {
			vendorMap.set(vend._id, vend);
		});

		this.props.carts.forEach(function(ingredients) {
			ingredients.ingredients.forEach(function(ing) {

				frontEndCart.push(
					{key: keyCount, fullIng: ing, amt: ing.amount}
				)
				keyCount++;
			})
		});

		//console.log(frontEndCart)

		return frontEndCart.length > 0 ? frontEndCart.map(ingredient => (
			<tr key={ingredient.key}>
				<td>{ingMap.get(ingredient.fullIng.ingredient).name}</td>
				<td>{this.renderEditableAmount(ingredient)}</td>
				<td>{ingMap.get(ingredient.fullIng.ingredient).nativeInfo.numNativeUnitsPerPackage
					+' '+ingMap.get(ingredient.fullIng.ingredient).nativeInfo.nativeUnit}</td>
				<EditVendor
					key={ingredient.fullIng.ingredient}
					ing={ingMap.get(ingredient.fullIng.ingredient)} 
					vendor={ingredient.fullIng.vendorInfo}
					source="cart"
					edit={this.state.edit}
					noButton={true}
					onChange={this.changeEditState.bind(this)}
				/>
				<td>
					<button
					onClick={this.remove.bind(ingredient)}
					title= "Edit">
						Remove From Cart
					</button>
				</td>
			</tr>
		)) : null;
	}

	

	changeEditState(newEdit) {
		console.log("Editing state:")
		if(newEdit == false) {
			console.log(this)
		}
		this.state.edit=newEdit;
		this.forceUpdate();
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
			<Button
				bsStyle="primary"
				onClick={this.edit.bind(this)}
				title= "Edit"
				>{this.editButtonText()}
			</Button>
		    	<table>
		    		<tbody>
		    			<tr>
		    				<th>Ingredient</th>
		    				<th>Packages</th>
		    				<th>Quantity</th>
		    				<th>Vendor</th>
		    				<th>Price</th>
						</tr>
	    				{this.renderCartItems()}
	    			</tbody>
	       		</table>
	       		{this.checkoutButton()}
			</div>
		)
	}
	edit(){
		this.changeEditState(!this.state.edit)
	}
	editButtonText() {
		return this.state.edit ? "Leave Edit Mode" : "Enter Edit Mode"
	}
	renderEditableAmount (ingredient) {
		if(this.state.edit) {
			return(
			<input
				type="text"
				defaultValue={ingredient.amt}
				ref="numPacks"
				onBlur={ e => {
					var message = "Change cart quantity from "
					message = message.concat(ingredient.amt).concat(" to ").concat(e.target.value).concat("?\n")
					message = message.concat("This change will happen immediately. \nYou do not need to hit submit to finalize this change.")
					if(confirm(message)) {
						e.persist()
						Meteor.call('cart.changeQuantity', 
						ingredient.fullIng.ingredient,
						e.target.value,
						function(error,result){
							if(error){
								console.log("something goes wrong with the following error message " + error.reason )
								Bert.alert(error.reason, 'danger');
								e.target.value = ingredient.amt
							}
						})
					}
				}}
				placeholder="Native Unit"
			/>
			);
		} else {
			return(
				<>
				{ingredient.amt}
				</>
			);
		}
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
})(IngredientCart);
