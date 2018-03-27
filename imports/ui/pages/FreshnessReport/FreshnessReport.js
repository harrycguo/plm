import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import FreshReport from '../../../api/FreshReport/FreshReport.js';
import FreshTotal from '../../../api/FreshReport/FreshTotal.js'
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';

class FreshnessReport extends Component {

	headerValues() {
		return [
			{
				Header: 'Name',
				accessor: 'name',
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
				Header: 'Average Time',
				accessor: 'avgTime',
				Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by Average Time"
	      />
			},
			{
				Header: 'Worst-case Time',
				accessor: 'wcTime',
				Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by Worst Time"
	      />
			},
		];
	}

	renderRows(_this) {
		var reportRows = new Array()

		this.props.freshreport.forEach(function(item){
			var form = Intermediates.find({_id: item.inventoryID}).fetch()[0]
			var ing = IngredientList.find({_id: item.inventoryID}).fetch()[0]
			var name = undefined
			if(form){
				//Formula
				name = form.name
			} else if(ing){
				name = ing.name
			}
			reportRows.push({
				name: name,
				avgTime: item.avgTimeString,
				wcTime: item.worstCaseString,
			})
		})
		return reportRows;

		// var reportRows = new Array()
		// this.props.ingredients.forEach(function(ing) {
		// 	reportRows.push({
		// 		ing: ing.name,
		// 		total: ing.spendingInfo.totalSpending,
		// 		prod: ing.spendingInfo.totalProdSpending,
		// 	})
		// });
		// return reportRows;
	}

	render() {
		return (
			<div>
			<div>
			<ControlLabel>Total: Average Time</ControlLabel>
			<p></p>
			<p><b>Average Time Overall Freshness</b>: {this.props.freshtotal[0] ? this.props.freshtotal[0].avgTimeString : ""}</p>
			<p></p>
			<p><b>Worst Time Overall Freshness</b>: {this.props.freshtotal[0] ? this.props.freshtotal[0].worstCaseString : ""}</p>
			<ControlLabel>Total: Worst Case</ControlLabel>
			<p></p>
			{this.props.freshtotal[0] ? this.props.freshtotal[0].worstCaseString : ""}
			<p>(Days: Hours: Minutes)</p>
			</div>
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
	Meteor.subscribe('freshreport')
	Meteor.subscribe('freshtotal')
	Meteor.subscribe('ingredients')
	Meteor.subscribe('intermediates')
	return {
		freshreport: FreshReport.find({}).fetch(),
		freshtotal: FreshTotal.find({}).fetch(),
		ingredients: IngredientList.find({}).fetch(),
		intermediates: Intermediates.find({}).fetch(),

		// intermediates: Intermediates.find({}).fetch()
	};
})(FreshnessReport);
