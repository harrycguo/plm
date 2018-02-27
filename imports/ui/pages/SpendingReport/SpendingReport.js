import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'

class SpendingReport extends Component {

	linkBack() {
		return (<li><Link to='/inventoryManagement'>Return to Inventory</Link></li>)
	}

	headerValues() {
		return [
			{
				Header: 'Ingredient',
				accessor: 'ing',
			}, 
			{
				Header: 'Total Spending',
				accessor: 'total',
			},
			{
				Header: 'Production Spending',
				accessor: 'prod',
			},
		];
	}

	renderRows(_this) {
		var reportRows = new Array()
		this.props.ingredients.forEach(function(ing) {
			reportRows.push({
				ing: ing.name,
				total: ing.spendingInfo.totalSpending,
				prod: ing.spendingInfo.totalProdSpending,
			})
		});
		return reportRows;
	}

	render() {
		return (
			<div className="container" >
			<header>
          		<h1>Spending Report</h1>
        	</header>
			<InventoryManagementNavBar/>
			<p></p>
       		<ReactTable
	    		data={this.renderRows(this)}
	    		filterable
	    		defaultFilterMethod={ (filter, row) => 
	    			String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
				}
	    		columns={this.headerValues()}
	  		/>
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	return {
		ingredients: IngredientsList.find({}).fetch()
	};
})(SpendingReport);
