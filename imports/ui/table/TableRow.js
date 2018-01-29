import React, { Component } from 'react';
import { Button } from 'react';
import RowElement from './RowElement.js';
import { Meteor } from 'meteor/meteor';
import { IngredeintsList } from '../../api/IngredientList.js';

export default class TableRow extends Component {

	renderRowElements() {
		return this.props.element.value.map(element => (
			<RowElement key={element._id} element={element}/>
		));
	}

	handleDeletePress() {
		var db = this.props.element.value[6].value;
		var id = this.props.element.value[5].value._id;
		//Meteor.call('removeIngredient', id)
		db.remove(id)
	}

	render() {
		return (
			<tr key="FullRow">
				{this.renderRowElements()}
				<td key="DeleteElement"><button 
					key="DeleteButton"
					onClick={this.handleDeletePress.bind(this)}
					title="Delete"
					color="#ff0000"
				> Delete </button></td>
			</tr>
		);
	}


}