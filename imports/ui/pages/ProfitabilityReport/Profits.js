import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import Formulas from '../../../api/Formulas/formulas.js'
import ProfReport from '../../../api/ProfitabilityReport/ProfReport.js'
import ProfReportTotal from '../../../api/ProfitabilityReport/ProfReportTotal.js'

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
		this.props.profreport.forEach(function(item) {
			items.push({
				name: Formulas.findOne({_id: item.id}).name, 
				sold: item.unitsSold,
				price: item.avgWholesalePrice,
				rev: item.wholesaleRevenue,
				cost: item.totalCost,
				tprof: item.totalProfit,
				puprof: item.perUnitProfit,
				marg: item.profitMargin,
			})
		})
		return items;
	}

	renderTable(){
		console.log(this.props.profreporttotal.length)

		return (
			<div>
			<p></p>
			<p><b>Total Units Sold</b>: {this.props.profreporttotal[0] ? this.props.profreporttotal[0].unitsSold : ""}</p>
			<p></p>
			<p><b>Average Wholesale Price</b>: {this.props.profreporttotal[0] ? this.props.profreporttotal[0].avgWholesalePrice : "" }</p>
			<p></p>
			<p><b>Wholesale Revenue</b>: {this.props.profreporttotal[0] ? this.props.profreporttotal[0].wholesaleRevenue : ""}</p>
			<p></p>
			<p><b>Total Cost</b>: {this.props.profreporttotal[0] ? this.props.profreporttotal[0].totalCost : "" }</p>
			<p></p>
			<p><b>Total Profit</b>: {this.props.profreporttotal[0] ? this.props.profreporttotal[0].totalProfit : ""}</p>
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
	Meteor.subscribe('profreport')
	Meteor.subscribe('profreporttotal')

	return {
		formulas: Formulas.find({}).fetch(),
		profreport: ProfReport.find({}).fetch(),
		profreporttotal: ProfReportTotal.find({}).fetch(),
	};
})(Profits);