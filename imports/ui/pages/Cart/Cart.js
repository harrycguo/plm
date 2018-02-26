import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsApi from '../../../api/Ingredients/IngredientsApi.js';
import { Vendors } from '../../../api/Vendors/vendors.js';
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

		return frontEndCart.length > 0 ? frontEndCart.map(ingredient => (
			<tr key={ingredient.key}>
				<td>{ingMap.get(ingredient.fullIng.ingredient).name}</td>
				<td>{this.renderEditableAmount(ingredient)}</td>
				<td>{this.getNativeUnits(ingMap, ingredient)}</td>
				<td>{this.renderVendorSelector(
					ingMap.get(ingredient.fullIng.ingredient),
					vendorMap,
					vendorMap.get(ingredient.fullIng.vendorInfo.vendor))}</td>
				<td>{ingredient.fullIng.vendorInfo.price}</td>
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

	getNativeUnits(ingMap, ingredient){
		var totalNum = ingMap.get(ingredient.fullIng.ingredient).nativeInfo.numNativeUnitsPerPackage * ingredient.amt
		return (totalNum.toString().concat(" ").concat(ingMap.get(ingredient.fullIng.ingredient).nativeInfo.nativeUnit))
	}
	
	renderVendorSelector(ingredient, vendorMap, vendorInfo) {
		var ingredientVendors = ingredient.vendorInfo
		let items = new Array();
		ingredientVendors.forEach(function(possibleVendor) {
			var newVendorId = possibleVendor.vendor
			if(vendorMap.get(newVendorId)) {
			var newVendorName = vendorMap.get(newVendorId).vendor
				var oldVendorId = vendorInfo._id
				var oldVendorName = vendorMap.get(oldVendorId).vendor
				if(oldVendorId == newVendorId){
					items.push(
					<option selected="selected" key={newVendorId} value={newVendorId}> 
						{newVendorName + ' | ' + possibleVendor.price} 
					</option>)
				} else {
					items.push(
					<option key={newVendorId} value={newVendorId}> 
						{newVendorName + ' | ' + possibleVendor.price} 
					</option>)
				}
			}
		})
		if(this.state.edit) {
			return(
				<select
		            name="vendor"
		            onChange={e => {
		           		var message = "Change vendor in cart from "
		           		message = message.concat(vendorMap.get(vendorInfo._id).vendor).concat(" to ").concat(vendorMap.get(e.target.value).vendor)
		           		if(confirm(message)) {
				           	Meteor.call('cart.changeVendor',
								ingredient._id,
								e.target.value,
								function(error, result) {
									if(error){
										console.log("something goes wrong with the following error message " + error.reason )
										Bert.alert(error.reason, 'danger');
									}
								}
							)
			           } else {
			           	e.target.value = vendorInfo._id
			           }
		           	}
		           }>
		           {items}
				</select>
          	)
		} else {
			return (<div>{vendorInfo.vendor}</div>)
		}
	}

	changeEditState(newEdit) {
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
