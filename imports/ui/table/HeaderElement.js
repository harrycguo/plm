import React, { Component } from 'react';

export default class HeaderElement extends Component {
	render() {
		return (
			<th>{this.props.element.value}</th>
		);
	}
}
