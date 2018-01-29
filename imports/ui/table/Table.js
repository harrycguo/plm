import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientsApi from '../../api/IngredientsApi.js';
import IngredientsList from '../../api/IngredientList.js';
import TableData from './TableData.js'
import ReactTable from 'react-table'

class Table extends Component {
	
	renderRows() {
		var ingredientsList = new Array()
		this.props.ingredients.forEach(function(ing) {
			ingredientsList.push(TableData.convertToFrontend(ing, IngredientsList))
		});
		console.log(ingredientsList)
		return ingredientsList
	}
	
	renderHeader() {
		return TableData.HeaderValues.map(element => (
			<HeaderElement key={element._id} element={element}/>
		));
	}

	render() {

		  return (<ReactTable
		    data={this.renderRows()}
		    filterable
		    defaultFilterMethod={ (filter, row) => 
		    	String(row[filter.id]).includes(filter.value)
		}
		    columns={TableData.HeaderValues}
		  />);
	}
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	console.log(IngredientsList)
	return {
		ingredients: IngredientsList.find({}).fetch()
	};
})(Table);