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
import { Button } from 'react-bootstrap';
import AddVendor from './AddVendor.js';

class Table extends Component {
	
	////////////////////////////////////////////////
	///											 ///
	/// Basic Renders							 ///
	///											 ///
	////////////////////////////////////////////////
	
	constructor(props) {
		super(props);
	}

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

	////////////////////////////////////////////////
	///											 ///
	/// Standard Admin Button Renders			 ///
	///											 ///
	////////////////////////////////////////////////

	edit() {
		TableData.toggleEditable()
		this.forceUpdate()
	}
	
	remove() {
		Meteor.call('removeIngredient', this.row._original.fullIng._id)
	}
	
	renderButtons(_this, row) {
		if(TableData.canEdit) {
			return (<div>
				
				<button
				onClick={this.remove.bind(row)}
				>Remove Ingredient</button> 
				</div>
			)
		}else {
			return null
		}

	}

	////////////////////////////////////////////////
	///											 ///
	/// Vendor Related Rendors 					 ///
	///											 ///
	////////////////////////////////////////////////
	
	deleteVendor(){
		console.log("deleting")
		console.log(this)
		Meteor.call('removeVendor',
			row.original.fullIng,
			vendor,
			function(error,result){
                if(error){
                   	console.log("something goes wrong with the following error message " + error.reason )
               	  	Bert.alert(error.reason, 'danger');
                }
			}
		);
	}
	
	renderVendorRows(row) {
		if(TableData.canEdit) {
			return row.original.vendors.map(vendor => (
				<tr key={vendor.name}>
					<td>{vendor.name}</td>
					<td>{vendor.cost}</td>
					<td>
					<button
						onClick={e=> {
							Meteor.call('removeVendor',
								row.original.fullIng,
								vendor,
								function(error,result){
					                if(error){
					                   	console.log("something goes wrong with the following error message " + error.reason )
					               	  	Bert.alert(error.reason, 'danger');
					                }
								}
							);
						}}
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
							Meteor.call('orderIngredient',
								row.original.fullIng,
								vendor,
								function(error,result){
                   					if(error){
                        				console.log("something goes wrong with the following error message " + error.reason )
               	  						Bert.alert(error.reason, 'danger');
                  					}
								}
							);
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

	////////////////////////////////////////////////
	///											 ///
	/// Ingredient Useage and Cart Renders		 ///
	///											 ///
	////////////////////////////////////////////////
	
	renderIngredientUse(row) {
		if(!TableData.canEdit) {
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
	
	////////////////////////////////////////////////
	///											 ///
	/// Render me daddy							 ///
	///											 ///
	////////////////////////////////////////////////
	
	render() {
		return (
			<div>
			
			<Button
				onClick={this.edit.bind(this)}
				title= "Edit"
				>Toggle Edit Mode</Button>
				<p></p>
		   	<ReactTable
		    data={this.renderRows()}
		    filterable
		    defaultFilterMethod={ (filter, row) => 
		    	String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
			}
		    columns={TableData.HeaderValues}
		    SubComponent={row => {
		    	return (
		    		<div style={{ padding: "5px" }}>
		    			<table>
		    			<tbody>
		    				<tr>
		    					<th>Vendor</th>
		    					<th>Price</th>
		    				</tr>
		    				{this.renderVendorRows(row)}
		    				<AddVendor ing={row.original.fullIng}/>
		    			</tbody>
		    			</table>
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