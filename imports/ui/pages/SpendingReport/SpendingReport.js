import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'

class SpendingReport extends Component {

	headerValues() {
		return [
			{
				Header: 'Ingredient',
				accessor: 'ing',
				Filter: ({ filter, onChange }) =>
				<input
					type="text"
					onChange={event => onChange(event.target.value)}
					style={{ width: '100%', height: '100%'}}
					value={filter ? filter.value : ''}
					placeholder="Filter by name"
				/>
			}, 
			{
				Header: 'Total Spending',
				accessor: 'total',
				Filter: ({ filter, onChange }) =>
				<input
					type="text"
					onChange={event => onChange(event.target.value)}
					style={{ width: '100%', height: '100%'}}
					value={filter ? filter.value : ''}
					placeholder="Filter by Total Spending"
				/>
			},
			{
				Header: 'Production Spending',
				accessor: 'prod',
				Filter: ({ filter, onChange }) =>
				<input
					type="text"
					onChange={event => onChange(event.target.value)}
					style={{ width: '100%', height: '100%'}}
					value={filter ? filter.value : ''}
					placeholder="Filter by Production Spending"
				/>
			},
		];
	}

	renderRows(_this) {
		var reportRows = new Array()
		this.props.ingredients.forEach(function(ing) {
			reportRows.push({
				ing: ing.name,
				total: ing.spendingInfo.totalSpending.toFixed(2),
				prod: ing.spendingInfo.totalProdSpending.toFixed(2),
			})
		});
		return reportRows;
	}

	render() {
		return (
			<div >

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
