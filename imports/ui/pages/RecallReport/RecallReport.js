import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { button } from 'react';
import ReactTable from 'react-table';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';

import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import LotsHistory from '../../../api/Lots/LotsHistory.js'
import Formulas from '../../../api/Formulas/formulas.js'
import Vendors from '../../../api/Vendors/vendors.js'


class RecallReportView extends Component {
	constructor(props) {
		super(props);
	}
	
	renderRows() {
		this.props.lotshistory.forEach( function(item) {
			console.log("ITER")
			console.log(item)
			var ing = IngredientList.find({_id: item.inventoryID}).fetch()[0]
			var form = Formulas.find({_id: item.inventoryID}).fetch()[0]
			var int = Intermediates.find({_id: item.inventoryID}).fetch()[0]
			console.log(ing)
			console.log(form)
			console.log(int)

			if(ing) {
				//Ingredient
			} else if(form) {
				// Full formula, recurse
			} else if(int) {
				// Intermediate Formula, recurse
			}


		});
		return null;
	}

	render() {
		console.log("Recall Report's This:")
		console.log(this)
    	return (
      	<div>
      	<table>
      	<tbody>
      		<tr>
      			<th>Name</th>
      			<th>asdf</th>
      		</tr>
      		{this.renderRows()}
      	</tbody>
      	</table>

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




