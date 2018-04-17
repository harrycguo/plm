import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { SystemLog } from '../../api/Log/systemlog.js';
import { Intermediates } from '../../api/Intermediates/intermediates.js';
import Formulas  from '../../api/Formulas/formulas'

import Datetime from 'react-datetime'
class LogTable extends Component {
	
	////////////////////////////////////////////////
	///											 ///
	/// Basic Renders							 ///
	///											 ///
	////////////////////////////////////////////////
	
	constructor(props) {
		super(props);
		console.log(this)
		this.state = {
			filterlow: -1,
			filterhigh: -1,
		}
	}


	renderRows(_this) {
		var systemLog = new Array()
		this.props.log.forEach(function(logItem) {
			systemLog.push(_this.convertToFrontend(logItem))
		});
		return systemLog
	}

	convertToFrontend(logItem) {

		// Change the time to a good looking string: 
		var timeString = new Date(logItem.time).toString();

		return {
			type: logItem.type, 
			name: logItem.name,
			change: logItem.change,
			to: logItem.to,
			user: logItem.user,
			time: timeString,
			truetime: logItem.time,
			_id: logItem.id,
		}
	}
	displayLink(cellInfo) {
		if(cellInfo.original.type == "Formula" || cellInfo.original.type == "Intermediate") {
			console.log(cellInfo.original)
			var final = Formulas.findOne({_id: cellInfo.original._id})
			var int = Intermediates.findOne({_id: cellInfo.original._id})
			console.log(final)
			console.log(int)
			if(int) {
				return (<li><Link to={{
			        pathname: '/viewIntermediate/'+int._id, 
			        state: {
			            formula: int,
			        }}}>Detail Page</Link></li>)
        	} else if(final) {
        		return (<li><Link to={{
		        	pathname: '/viewFormula/'+final._id, 
		        	state: {
		          		formula: final,
		        	}}}>Detail Page</Link></li>)
        	}
        	return null
		} else if(cellInfo.original.type == "Ingredient") {
			return(
				<li><Link to={{
        		pathname: '/inventoryManagement',
        		state: {
            		name: cellInfo.original.name,
        		}}}>Detail Page</Link></li>)
		}
		else {
			return null
		}

	}
	////////////////////////////////////////////////
	///											 ///
	/// Render 									 ///
	///											 ///
	////////////////////////////////////////////////
	renderTable(_this) {
		return ( 
			<ReactTable
		    data={_this.renderRows(_this)}
		    filterable
		    defaultFilterMethod={ (filter, row) => 
		    	String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
			}
		    columns={[
			{
				Header: 'Type',
				accessor: 'type',
				filterMethod: (filter, row) => {
					if(filter.value === 'all') {
						return true;
					}
					else {
						return row[filter.id]===filter.value;
					}
				},
				Filter: ({ filter, onChange }) =>
			      <select
			        onChange={event => onChange(event.target.value)}
			        style={{ width: '100%', height: '100%'}}
			        value={filter ? filter.value : 'all'}
			      >
			        <option value="all">All</option>
			        <option value="Ingredient">Ingredient</option>
			        <option value="Intermediate">Intermediate</option>
			        <option value="Formula">Formula</option>
					<option value="Vendor">Vendor</option>
					<option value="Production">Production</option>
					<option value="Production Line">Production Line</option>
			        <option value="Storage Capacities">Storage Capacities</option>
					<option value="Cart">Cart</option>
					<option value="User">User</option>
			      </select>,
			}, 
			{
				Header: 'Name',
				accessor: 'name',
				Filter: ({ filter, onChange }) =>
			      <input
			        type="text"
			        onChange={event => onChange(event.target.value)}
			        style={{ width: '100%', height: '100%'}}
			        value={filter ? filter.value : ''}
			        placeholder="Filter by name"
			      />
			}, 
			
			{
				Header: 'Change',
				accessor: 'change',
				filterMethod: (filter, row) => {
					if(filter.value === 'all') {
						return true;
					}
					else {
						return row[filter.id]===filter.value;
					}
				},
				Filter: ({ filter, onChange }) =>
			      <select
			        onChange={event => onChange(event.target.value)}
			        style={{ width: '100%', height: '100%'}}
			        value={filter ? filter.value : 'all'}
			      >
			        <option value="all">All</option>
			        <option value="Added">Added</option>
			        <option value="Modified">Modified</option>
			        <option value="Removed">Removed</option>
			        <option value="Event">Event</option>
			      </select>,
			},
			{
				Header: 'To',
				accessor: 'to',
				Filter: ({ filter, onChange }) =>
			      <input
			        type="text"
			        onChange={event => onChange(event.target.value)}
			        style={{ width: '100%', height: '100%'}}
			        value={filter ? filter.value : ''}
			        placeholder="Filter by new value"
			      />
			}, 
			{
				Header: 'Acting User',
				accessor: 'user',
				Filter: ({ filter, onChange }) =>
			      <input
			        type="text"
			        onChange={event => onChange(event.target.value)}
			        style={{ width: '100%', height: '100%'}}
			        value={filter ? filter.value : ''}
			        placeholder="Filter by quantity"
			      />
			},
			{
				Header: 'Time',
				accessor: 'time',
				filterMethod: (filter, row) => {
					console.log(filter)
					console.log(row._original.truetime)
					if(this.state.filterlow<0 && this.state.filterhigh<0) {
						return true;
					}
					else if(this.state.filterhigh<0 && this.state.filterlow>=0){
						return (Number(this.state.filterlow) < row._original.truetime)
					}
					else{
						return (Number(this.state.filterlow) < row._original.truetime && 
							row._original.truetime < Number(this.state.filterhigh) );
					}
				},
				Filter: ({ filter, onChange }) => (
			      <div>
			      	<Datetime 
			      	defaultValue = {new Date(0)}
			      	onChange = {event => {
			      		var x = new Date(event._i)
			      		this.state.filterlow = isNaN(Date.parse(x)) ? this.state.filterlow : Date.parse(x);
						onChange(Date.parse(this.state.filterlow))
			      	}}
			      	/>
			      	<Datetime 
			      	defaultValue = {new Date(Date.now())}
			      	onChange = {event => {
			      		var x = new Date(event._i)
			      		this.state.filterhigh = isNaN(Date.parse(x)) ? this.state.filterhigh : Date.parse(x);
			      		onChange(Date.parse(this.state.filterhigh))
			      	}}
			      	/>
				</div>
				)
			}, 	
			{
				Header: 'Link',
				accessor: 'link',
				Cell: _this.displayLink,
			},
		]}
		defaultSorted={[
            {
              id: "time",
              desc: true
            }
          ]}
		  />
		);
	}
	render() {
		return (
			<div>
			{this.renderTable(this)}
		   	</div>
		);

	}
	editButtonText() {
		return TableData.canEdit ? "Leave Edit Mode" : "Enter Edit Mode"
	}
	
}

export default withTracker(() => {
	const subscription = Meteor.subscribe('intermediates')
	Meteor.subscribe('log')
	Meteor.subscribe('formulas')
	return {
		log: SystemLog.find({}).fetch(),
		intermediates: Intermediates.find({}).fetch(),
        formulas: Formulas.find({}).fetch(), 
	};
})(LogTable);