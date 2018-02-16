import React, { Component } from 'react';

export var canEdit = false;

export function toggleEditable() {
	canEdit = !canEdit;
}

function renderEditable(cellInfo) {
	if(canEdit) {
		return(<input 
			type="text" 
			defaultValue={cellInfo.value}
			onBlur = {e => {
				e.persist()
				if(cellInfo.column.id === 'name'){	
					var message = "Edit Name\nFrom "
					message = message.concat(cellInfo.original.name).concat(" to ").concat(e.target.value);
					if(confirm(message)) {
						Meteor.call('editName', 
							cellInfo.original.fullIng._id, 
							e.target.value,  
							function(error,result){
	                   			if(error){
	                        		console.log("something goes wrong with the following error message " + error.reason )
	               	  				Bert.alert(error.reason, 'danger');
									e.target.value = cellInfo.original.name;
								}
							});
					} else {
						e.target.value = cellInfo.original.name;
					}
				} else if (cellInfo.column.id === 'qty') {
					var message = "Edit Quantity\nFrom "
					message = message.concat(cellInfo.original.qty).concat(" to ").concat(e.target.value);
					if(confirm(message)) {
						var entry = parseInt(e.target.value)
						if(entry >= 0) {
							Meteor.call('editQuantity', cellInfo.original.fullIng._id, Number(entry),
								function(error,result){
	                   			if(error){
	                        		console.log("something goes wrong with the following error message " + error.reason )
	               	  				Bert.alert(error.reason, 'danger');
	                  			}
							});
						} else {
							Bert.alert('Must be greater than or equal to zero', 'danger');
							e.target.value = cellInfo.original.qty;
						}
					} else {
						e.target.value = cellInfo.original.qty;
					}
				} else if (cellInfo.column.id === 'unit') {
					var message = "Edit Native Units\nFrom "
					message = message.concat(cellInfo.original.units).concat(" to ").concat(e.target.value);
					if(confirm(message)) {
	// 					Meteor.call('editNativeUnits', 
	// 						cellInfo.original.fullIng._id, 
	// 						e.target.value,  
	// 						function(error,result){
	//                    			if(error){
	//                         		console.log("something goes wrong with the following error message " + error.reason )
	//                	  				Bert.alert(error.reason, 'danger');
	// 								e.target.value = cellInfo.original.units;
	// 							}
	// 						}
	// 					);
					} else {
						// e.target.value = cellInfo.original.units;
					}
				}
			}}
			/>); 

	} else {
		return(<div style = {{ backgroundColor: "#ffffff" }}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value
			}}
		/>);
	}
}

function renderEditableDropdown(cellInfo) {
	if(canEdit) {
		if(cellInfo.column.id === 'temp') {
			//Drop down menu with the three options
			return(
			<select 
			value = { cellInfo.original.temp }
			id = "selTemperatureState" 
			ref="temperatureState" 
			onChange={ e=> {
				var message = "Edit Temperature State\nFrom "
				message = message.concat(cellInfo.original.temp).concat(" to ").concat(e.target.value);
				if(confirm(message)) {
					Meteor.call('editTemperatureState', 
						cellInfo.original.fullIng._id, 
						e.target.value,
						function(error,result){
	                   		if(error){
	                        	console.log("something goes wrong with the following error message " + error.reason )
	               	  			Bert.alert(error.reason, 'danger');
	                  		}
						}
					);
				}
			}}
			>
			   <option value = "frozen">Frozen</option>
			   <option value = "refrigerated">Refrigerated</option>
			   <option value = "room temperature">Room Temperature</option>
			</select>);			
		} else if(cellInfo.column.id === 'pkg') {
			// Same as above but with packaging options
			return(
			<select 
			id = "selPackaging" 
			ref="packaging"
			value = {cellInfo.original.pkg.toLowerCase()}
			onChange={ e=> {
				var message = "Edit Packaging\nFrom "
				message = message.concat(cellInfo.original.pkg).concat(" to ").concat(e.target.value);
				if(confirm(message)) {
					Meteor.call('editPackage', 
						cellInfo.original.fullIng._id, 
						e.target.value,
						function(error,result){
	                   		if(error){
	                       		console.log("something goes wrong with the following error message " + error.reason )
	               	  			Bert.alert(error.reason, 'danger');
	                  		}
						}
					);
				}
			}}
			>
			   <option value = "sack">Sack (50 lbs)</option>
			   <option value = "pail">Pail (50 lbs)</option>
			   <option value = "drum">Drum (500 lbs)</option>
			   <option value = "supersack">Supersack (2000 lbs)</option>
			   <option value = "truckload">Truckload (50000)</option>
			   <option value = "railcar">Railcar (280000)</option>
			</select>
			);
		}
		
	} else {
		return(<div style = {{ backgroundColor: "#ffffff" }}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value.replace(/\w\S*/g, function(txt){ 
					// https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
			}}
		/>);
	}
}

export const HeaderValues = [
	{
		Header: 'Name',
		accessor: 'name',
		Cell: renderEditable,
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
		Header: 'Temperature State',
		accessor: 'temp',
		Cell: renderEditableDropdown,
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
	        <option value="frozen">Frozen</option>
	        <option value="refrigerated">Refrigerated</option>
	        <option value="room temperature">Room Temperature</option>
	      </select>,
	}, 
	{
		Header: 'Packaging',
		accessor: 'pkg',
		Cell: renderEditableDropdown,
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
	        <option value="sack">Sack</option>
	        <option value="pail">Pail</option>
	        <option value="drum">Drum</option>
	        <option value="supersack">Supersack</option>
	        <option value="truckload">Truckload</option>
	        <option value="railcar">Railcar</option>
	      </select>,
	},
	{
		Header: 'Native Units',
		accessor: 'unit',
		Cell: renderEditable,
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by units"
	      />
	}, 
	{
		Header: 'Quantity',
		accessor: 'qty',
		Cell: renderEditable,
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
		Header: 'Number of Packages',
		accessor: 'numpkg',
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by number of packs"
	      />
	}, 
];

export function convertToFrontend(ingredient, ingredientsList) {
	VendArray = new Array()
	ingredient.vendorInfo.forEach(function(info){
		var vendor = info.vendor;
		if(vendor != null && vendor._id != null && info.price != -1) {
			VendArray.push({_id: vendor._id, name: vendor.vendor, cost: info.price});
		}
	});
	
	return {
			name: ingredient.name, 
			temp: ingredient.temperatureState, 
			pkg: ingredient.package, 
			amt: ingredient.numPackages,
			qty: ingredient.quantity, 
			vendors: VendArray,
			fullIng: ingredient
	}
}