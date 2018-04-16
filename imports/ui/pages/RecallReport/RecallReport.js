import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { button } from 'react';
import ReactTable from 'react-table';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';
import RecallChild from './RecallChild.js'
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import LotsHistory from '../../../api/Lots/LotsHistory.js'
import Formulas from '../../../api/Formulas/formulas.js'
import Vendors from '../../../api/Vendors/vendors.js'


class RecallReportView extends Component {
	constructor(props) {
		super(props);
	}
	renderRows(_this) {
		var systemLog = new Array()
		this.props.log.forEach(function(logItem) {
			systemLog.push(_this.convertToFrontend(logItem))
		});
		return systemLog
	}
	renderRows() {
		var rows = new Array()
		this.props.lotshistory.forEach( function(item) {
			console.log("ITER")
			console.log(item)
			var ing = IngredientList.find({_id: item.inventoryID}).fetch()[0]
			var form = Formulas.find({_id: item.inventoryID}).fetch()[0]
			var int = Intermediates.find({_id: item.inventoryID}).fetch()[0]
			console.log(ing)
			console.log(form)
			console.log(int)
			if(form == undefined) {
			rows.push( 
			{ 
				type: ing != undefined ? "Ingredient" : "Intermediate",
				name: ing != undefined ? ing.name : int.name,
				lots: item.queue.length,
				item: item
			});
			}

		});
		return rows;
	}

	render() {
		console.log("Recall Report's This:")
		console.log(this)
    	return (
      	<div>
      	<ReactTable 
			data={this.renderRows()}
		    filterable
		    defaultFilterMethod={ (filter, row) => 
		    	String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
			}
		    columns={[
				{
					Header: 'Type',
					accessor: 'type',
				}, 
				{
					Header: 'Name',
					accessor: 'name',
				}, 
				{
					Header: 'Number of Lots',
					accessor: 'lots',
				}
			]}
			SubComponent={row => {
				console.log(row.original)
				return row.original.item.queue.map(lot => (
					<details key={lot.lot}>
					<summary>
					<div> Lot number {lot.lot} </div>
					</summary>
					Child goes here
					</details>
				));
				// return (<div>break</div>)
			}}

      	/>

        	Recall Report Goes Here
      	</div>
    	);
  	}
}

export default withTracker(() => {
	Meteor.subscribe('recallreport')
	Meteor.subscribe('ingredients')
	Meteor.subscribe('intermediates')
	Meteor.subscribe('formulas')
	// Meteor.subscribe('vendors')
	return {
		ingredients: IngredientList.find({}).fetch(),
		intermediates: Intermediates.find({}).fetch(),
		formulas: Formulas.find({}).fetch(),
		lotshistory: LotsHistory.find({}).fetch(),
		// vendors: Vendors.find({}).fetch(),
	};
})(RecallReportView);


