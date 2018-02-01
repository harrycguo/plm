import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientsApi from '../../api/Ingredients/IngredientsApi.js';
import IngredientsList from '../../api/Ingredients/IngredientList.js';
import IngredientForm from '../forms/IngredientForm.js';
import TableData from './TableData.js';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class Table extends Component {
	
	renderRows() {
		var ingredientsList = new Array()
		this.props.ingredients.forEach(function(ing) {
			ingredientsList.push(TableData.convertToFrontend(ing, IngredientsList))
		});
		return ingredientsList
	}
	
	renderHeader() {
		return TableData.HeaderValues.map(element => (
			<HeaderElement key={element._id} element={element}/>
		));
	}
	edit() {
		TableData.toggleEditable()
		this.forceUpdate()
	}
	
	remove() {
		Meteor.call('removeIngredient', this.row._original.fullIng._id)
	}

	// VendArray.push({_id: 0, name: "Atlantic", cost: "$5.00"});
	// VendArray.push({_id: 1, name: "Alliant", cost: "$4.00"})
	deleteVendor(){
		console.log("deleting")
		console.log(this)
	}
	
	renderVendorRows(row) {
		if(TableData.editModeOn) {
			return row.original.vendors.map(vendor => (
				<tr key={vendor.name}>
					<td>{vendor.name}</td>
					<td>{vendor.cost}</td>
					<td>
					<button
						onClick={this.deleteVendor.bind(vendor)}
						title= "Remove Vendor"
						>Delete</button>
					</td>
				</tr>
			));
		}
		this.state = { value: '' };
		var qty = undefined
		var recentVendor = undefined
		return row.original.vendors.map(vendor => (
			<tr key={vendor.name}>
				<td>{vendor.name}</td>
				<td>{vendor.cost}</td>
				<td><input type="text" onChange={ e=> {
					qty = e.target.value;
					recentVendor = vendor;
				}}/></td>
				<td>
				<button
					onClick={e => {
						if(recentVendor === vendor) {
							console.log(qty)
							console.log(row.original.fullIng)
							console.log(vendor)
							console.log(this.refs)
						}
						
					}}
					title= "Remove Vendor"
				>
					Order Packages
				</button>
				</td>
			</tr>
		));
	}

	editVendors() {
		if(TableData.editModeOn) {
			return (
				<div> Hello Add Vendor Field </div>
			);
		}
		return null
	}

	renderIngredientUse(row) {
		if(!TableData.editModeOn) {
			return (
				<div><span>Num lbs to use</span>
				<button
					onClick={this.addToCart.bind(row.original.fullIng)}
					title= "Add To Cart"
				>
					Add To Cart
				</button>
				</div>

			)
		}
		return null
	}

	addToCart() {
		console.log("Add Ing to cart: ")
		console.log(this._id)
	}

	renderButtons(_this, row) {
		if(Meteor.user().username === "admin") {
			return (<div>
				<button
				onClick={this.edit.bind(_this)}
				title= "Edit"
				>Toggle Edit Mode</button>
				<button
				onClick={this.remove.bind(row)}
				>Remove Ingredient</button> 
				</div>
			)
		}else {
			return null
		}

	}

	render() {
		return (
			<div>
			<Link to='/addingredient'>Add Ingredient</Link>
		   	<ReactTable
		    data={this.renderRows()}
		    filterable
		    defaultFilterMethod={ (filter, row) => 
		    	String(row[filter.id]).includes(filter.value)
			}
		    columns={TableData.HeaderValues}
		    SubComponent={row => {
		    	return (
		    		<div style={{ padding: "5px" }}>
		    			<table >
		    			<tbody>
		    				<tr>
		    					<th>Vendor</th>
		    					<th>Price</th>
		    				</tr>
		    				{this.renderVendorRows(row)}
		    			</tbody>
		    			</table>
						{this.editVendors()}
						{this.renderIngredientUse(row)}
		    			{this.renderButtons(this, row)}
                	</div>
                );
		    }}
		  /></div>);

	}
}


export default withTracker(() => {
	Meteor.subscribe('ingredients')
	return {
		ingredients: IngredientsList.find({}).fetch()
	};
})(Table);