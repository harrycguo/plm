import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { SystemLog } from '../../api/Log/systemlog.js';

class LogTable extends Component {
	
	////////////////////////////////////////////////
	///											 ///
	/// Basic Renders							 ///
	///											 ///
	////////////////////////////////////////////////
	
	constructor(props) {
		super(props);
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
			from: logItem.from,
			to: logItem.to,
			user: logItem.user,
			time: timeString,
			truetime: logItem.time,
			_id: logItem._id,
		}
	}
	displayLink(cellInfo) {
		return null
		if(cellInfo.original.type == "Formula") {
			var url = '/editFormula/'
			url = url.concat(cellInfo.original._id)
			return(
				<li><Link to={url}>Detail Page</Link></li>
			)
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
			        <option value="Formula">Formula</option>
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
			        <option value="created">Created</option>
			        <option value="modified">Modified</option>
			        <option value="removed">Removed</option>
			      </select>,
			},
			{
				Header: 'From',
				accessor: 'from',
				Filter: ({ filter, onChange }) => (
			      
			      <input
			        type="text"
			        onChange={event => onChange(event.target.value)}
			        style={{ width: '100%', height: '100%'}}
			        value={filter ? filter.value : ''}
			        placeholder="Filter by old value"
			      />
			      )
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
			      <input
			      	type="text"
			      	ref="low"
			      	onChange={event=>{
			      		this.state.filterlow = event.target.value
			      		onChange(event.target.value)
			      		console.log(this.state)
			      	}}
			      	style={{width:'50%',height:'100%'}}
			      	value={this.state.filterlow >=0 ? this.state.filterlow :''}
			      	placeholder="Start Time"
			      />
			      <input
			        type="text"
			        ref="high"
			        onChange={event => {
			        	this.state.filterhigh = event.target.value
			      		onChange(event.target.value)
			      		console.log(this.state)
			        }}
			        style={{ width: '50%', height: '100%'}}
			        value={this.state.filterhigh > 0 ? this.state.filterhigh : ''}
			        placeholder="End Time"
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
	Meteor.subscribe('log')
	return {
		log: SystemLog.find({}).fetch(),
	};
})(LogTable);