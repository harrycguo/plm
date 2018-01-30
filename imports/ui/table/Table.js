import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientsApi from '../../api/Ingredients/IngredientsApi.js';
import IngredientsList from '../../api/Ingredients/IngredientList.js';
import IngredientForm from '../forms/IngredientForm.js';
import TableData from './TableData.js';
import ReactTable from 'react-table';

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
		console.log("edit pressed")
		console.log(this.row._original.fullIng)
	}
	
	remove() {
		console.log("remove pressed")
		console.log(this.row._original.fullIng)
		Meteor.call('removeIngredient', this.row._original.fullIng._id)
	}

	// VendArray.push({_id: 0, name: "Atlantic", cost: "$5.00"});
	// VendArray.push({_id: 1, name: "Alliant", cost: "$4.00"})

	renderVendorRows(row) {
		return row.original.vendors.map(vendor => (
			<tr key={vendor.name}>
				<td>{vendor.name}</td>
				<td>{vendor.cost}</td>
			</tr>
		));
	}

	render() {
		return (<ReactTable
		    data={this.renderRows()}
		    filterable
		    defaultFilterMethod={ (filter, row) => 
		    	String(row[filter.id]).includes(filter.value)
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
		    			</tbody>
		    			</table>

		    			<button
		    			onClick={this.edit.bind(row)}
		    			title= "Edit"
		    			>Edit </button>
		    			<button
		    			onClick={this.remove.bind(row)}
		    			>Remove </button>
                	</div>
                );
		    }}
		  />);
	}
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	return {
		ingredients: IngredientsList.find({}).fetch()
	};
})(Table);