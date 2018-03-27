import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';
import { Vendors } from '../../api/Vendors/vendors.js';

export class RecallChild extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	renderChild(count){
		if(count==0){
			return (<div>Done</div>);
		}else {
			return (<RecallChild count={count-1}/>)
		}

	}

	render() {

		return (
			<details>
			<summary>Header</summary>
			{this.renderChild(this.props.count)}
			</details>
		)
	}
}