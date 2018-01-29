import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import TableRow from './TableRow.js';
import RowElement from './RowElement.js';
import HeaderElement from './HeaderElement.js';
import TableData from './TableData.js'
import { IngredientsList } from '../../api/IngredientList.js';

class Table extends Component {
	
	renderRows() {
		var ingredientsList = new Array()
		this.props.ingredients.forEach(function(ing) {
			ingredientsList.push(TableData.convertToFrontend(ing, IngredientsList))
		});

		return ingredientsList.map(element => (
			<TableRow key={element._id} element={element}/>
		));
	}
	
	renderHeader() {
		return TableData.HeaderValues.map(element => (
			<HeaderElement key={element._id} element={element}/>
		));
	}

	render() {
		return (
			<div className="container"> 
				<header>
					<h1>Ingredient Table</h1>
				</header>
				<table>
					<tbody>
						<tr>
							{this.renderHeader()}
						</tr>
						{this.renderRows()}
					</tbody> 
				</table>
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	return {
		ingredients: IngredientsList.find({}).fetch()
	};
})(Table);