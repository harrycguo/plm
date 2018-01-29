import React, { Component } from 'react';

export default class TableRow extends Component {
	render() {
		if(this.props.element._id < 4) {
			return (
				<td key="RowElement">{this.props.element.value}</td>
			);
		}
		return null
	}
}