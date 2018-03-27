import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { button } from 'react';
import ReactTable from 'react-table';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';

import IngredientList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import RecallReport from '../../../api/RecallReport/RecallReport.js'
import Formulas from '../../../api/Formulas/formulas.js'

class RecallReportView extends Component {
	constructor(props) {
		super(props);
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
	return {
		ingredients: IngredientList.find({}).fetch(),
		intermediates: Intermediates.find({}).fetch(),
		formulas: Formulas.find({}).fetch(),
		recallreport: RecallReport.find({}).fetch(),

		// intermediates: Intermediates.find({}).fetch()
	};
})(RecallReportView);




