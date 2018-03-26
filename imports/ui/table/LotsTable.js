import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientsApi from '../../api/Ingredients/IngredientsApi.js';
import IngredientsList from '../../api/Ingredients/IngredientList.js';
import IngredientForm from '../forms/IngredientForm.js';
import TableData from './TableData.js';
import LotsTableData from './LotsTableData.js'
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button , ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { Vendors } from '../../api/Vendors/vendors.js';
import Lots from '../../api/Lots/Lots.js'
import LotsApi from '../../api/Lots/LotsApi.js'

class LotsTable extends Component {
	
	////////////////////////////////////////////////
	///											 ///
	/// Basic Renders							 ///
	///											 ///
	////////////////////////////////////////////////
	
	constructor(props) {
		super(props);
	}

	renderRows(ingredient, vendors) {
		var lotsList = new Array()
		console.log(ingredient._id)
		var lot = Lots.find({ingID: ingredient._id}).fetch()[0]
		console.log(lot)
		if(lot) {
			lot.queue.forEach(function(lot) {
				// qty lot vendor(op) price(op) time
				lotsList.push(
					LotsTableData.convertToFrontend(lot, ingredient, vendors)
				)
			})
		}
		return lotsList
	}
	
	renderHeader() {
		return TableData.HeaderValues.map(element => (
			<HeaderElement key={element._id} element={element}/>
          ));
	}


	////////////////////////////////////////////////
	///											 ///
	/// Render 									 ///
	///											 ///
	////////////////////////////////////////////////
	renderTable(_this) {
		console.log(_this)
		return (
			<div>
			<ReactTable
			data={_this.renderRows(_this.props.ingredient, _this.props.vendors)}
			filterable
			defaultPageSize={5}
			defaultFilterMethod={ (filter, row) => 
				String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
			}
			columns={LotsTableData.HeaderValues}
            />
            </div>
            );
	}

	render() {
		return (
			<div>
            {this.renderTable(this)}
            </div>
        );
	}
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	Meteor.subscribe('vendors')
	Meteor.subscribe('lots');
	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
		lots: Lots.find({}).fetch()
	};
})(LotsTable);