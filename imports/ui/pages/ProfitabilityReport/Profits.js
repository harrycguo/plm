import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import Formulas from '../../../api/Formulas/formulas.js'

class Profits extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	renderRows() {
		//var lots = this.props.item.original.item.queue
		//console.log("Child: render Rows: ")
		//console.log(lots)
		var items = new Array();
		// this.props.formulas.forEach(function(item) {
		// 	items.push({
		// 		name: Formulas.findOne({_id: item.inventoryID}), 
		// 		sold: item.unitsSold,
		// 		price: item.avgWholesalePrice,
		// 		rev: item.wholesaleRevenue,
		// 		cost: item.totalCost,
		// 		tprof: item.totalProfit,
		// 		puprof: item.perUnitProfit,
		// 		marg: item.profitMargin,
		// 	})
		// })
		return items;
	}

	renderTable(){
		return (
			<div>
			<p></p>
			<p><b>Total Units Sold</b>: {""}</p>
			<p></p>
			<p><b>Average Wholesale Price</b>: {""}</p>
			<p></p>
			<p><b>Wholesale Revenue</b>: {""}</p>
			<p></p>
			<p><b>Total Cost</b>: {""}</p>
			<p></p>
			<p><b>Total Profit</b>: {""}</p>
			<p></p>
			
		<div>
			<ReactTable 
				data={this.renderRows()}
			    columns={[
					{
						Header: 'Name',
						accessor: 'name',
					}, 
					{
						Header: 'Units Sold',
						accessor: 'sold',
					},
					{
						Header: 'Avg. Wholesale Price',
						accessor: 'price',
					},
					{
						Header: 'Wholesale Revenue',
						accessor: 'rev',
					},
					{
						Header: 'Total Ingredient Cost',
						accessor: 'cost',
					},
					{
						Header: 'Total Profit',
						accessor: 'tprof',
					},
					{
						Header: 'Per Unit Profit',
						accessor: 'puprof',
					},
					{
						Header: 'Profit Margin',
						accessor: 'marg',
					},

				]}

	      	/>
		</div></div>) 

	}

	render() {
		console.log("Step 4:")
		console.log(this.props)
		return (
			<>
			{this.renderTable()}
			</>
		)
	}
}

export default withTracker(() => {

	Meteor.subscribe('formulas')

	return {
		formulas: Formulas.find({}).fetch(),
	};
})(Profits);