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
import EditVendor from './EditVendor.js';
import CartApi from '../../api/Cart/CartApi.js';

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
		Meteor.call('removeVendor',
			row.original.fullIng,
			vendor,
			function(error,result){
                if(error){
                   	console.log("something goes wrong with the following error message " + error.reason )
               	  	Bert.alert(error.reason, 'danger');
                } else {
					Bert.alert('Successfully Removed Vendor', 'success');
				}
			}
		);
	}

	renderEditableVendorRows(row) {
		return row.original.vendors.map(vendor => (
			<tr key = {vendor.name}>
				<EditVendor key={vendor.name} ing={row.original.fullIng} vendor={vendor} edit={TableData.canEdit}/>
				<td> 
					<button
						onClick={e=> {
							var message = "Delete the vendor: "
							message = message.concat(vendor.name).concat(" from this ingredient?")
							if(confirm(message=message)) {
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
						}}
						title= "Remove Vendor"
					>Delete Vendor</button>
				</td>
			</tr>
		));
	}
	
	renderVendorRows(row, _this) {
		if(TableData.canEdit) {
			return _this.renderEditableVendorRows(row)
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
							Meteor.call('addIngredientToCart',
								row.original.fullIng, 
								qty, 
								function(error,result){
									if(error){
	                        				console.log("something goes wrong with the following error message " + error.reason )
	               	  						Bert.alert(error.reason, 'danger');
	                  				} else {
											Bert.alert('Successfully added ' + qty + ' lbs to Cart!', 'success')
									}
								}
							);
						}

					}}
				>
					Add Packages To Cart
				</button>
				</td>
			</tr>
		));
	}

	////////////////////////////////////////////////
	///											 ///
	/// Render 									 ///
	///											 ///
	////////////////////////////////////////////////
	renderTable(_this) {
		return ( 
			<div>
			<ReactTable
		    data={_this.renderRows()}
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
		    				{_this.renderVendorRows(row, _this)}
		    				<AddVendor ing={row.original.fullIng} edit={TableData.canEdit}/>
		    			</tbody>
		    			</table>
		    			{_this.renderButtons(_this, row)}
                	</div>
                );
		    }}
		  />
		  <span>Click on a header to sort that column!</span>
		  </div>
		);
	}
	render() {
		if (!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, 'admin')) {
			if(TableData.canEdit) {
				TableData.toggleEditable()
				this.forceUpdate()
			}
			return (
			<div>
			{this.renderTable(this)}
		   	</div>
			);
		}
		return (
			<div>
			<Button
			bsStyle="primary"
				onClick={this.edit.bind(this)}
				title= "Edit"
				>{this.editButtonText()}</Button>
				<p></p>
			{this.renderTable(this)}
		   	</div>
		);

	}
	editButtonText() {
		return TableData.canEdit ? "Leave Edit Mode" : "Enter Edit Mode"
	}
	
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	return {
		ingredients: IngredientsList.find({}).fetch()
	};
})(Table);