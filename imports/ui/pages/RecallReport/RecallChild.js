import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';
import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import LotsHistory from '../../../api/Lots/LotsHistory.js'
import Formulas from '../../../api/Formulas/formulas.js'
import Vendors from '../../../api/Vendors/vendors.js'

class RecallChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	renderRows() {
		var lots = this.props.item.original.item.queue
		console.log("Child: render Rows: ")
		console.log(lots)
		return new Array();
	}

	renderChild(){
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
	      	/>
		</div>) 

	}

	render() {
		console.log("CHILD")
		console.log(this.props)
		return (
			<details>
			<summary>Header</summary>
			{this.renderChild()}
			</details>
		)
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
})(RecallChild);