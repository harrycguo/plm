import React, { Component } from 'react';
import CustomNativeUnitsInput from '../forms/CustomNativeUnitInput.js'

export var canEdit = false;
var nativeUnitSwitch = false;

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
							Meteor.call('editTotalNumNativeUnits', cellInfo.original.fullIng._id, Number(entry),
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
				} else if (cellInfo.column.id === 'numNativeUnitsPerPackage') {
					var message = "Edit Number of Native Units Per Package\nFrom "
					message = message.concat(cellInfo.original.qty).concat(" to ").concat(e.target.value);
					if(confirm(message)) {
						var entry = parseInt(e.target.value)
						if(entry >= 0) {
							Meteor.call('editNumNativeUnitsPerPackage', cellInfo.original.fullIng._id, Number(entry),
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

function renderCustomField() {
	return (
		<input
				type="text"
				ref={customNativeUnit => (this.customNativeUnit = customNativeUnit)}
				name="customNativeUnit"
				placeholder="Native Unit"
			/>
	)
}

function renderEditableUnits(cellInfo) {
	if(canEdit) {
		return (
			<span>
				<select
					ref={nativeUnit => (this.nativeUnit = nativeUnit)}
					name="nativeUnit"
					placeholder="# of Native Units Per Package"
					onChange={ e => {
						console.log(e.target.value)
						if(e.target.value == "custom") {
							nativeUnitSwitch = true
						} else {
							
						}
					}}
				>
					<option value="Pounds">Pounds</option>
					<option value="Gallons">Gallons</option>
					<option value="custom">Custom...</option>
				</select>
				{renderCustomField()}
			</span>
		)
	}
	// 	if (cellInfo.column.id === 'unit') {
	// 		var message = "Edit Native Units\nFrom "
	// 		message = message.concat(cellInfo.original.units).concat(" to ").concat(e.target.value);
	// 		if(confirm(message)) {
	// 			Meteor.call('editNativeUnits', 
	// 				cellInfo.original.fullIng._id, 
	// 				e.target.value,  
	// 				function(error,result){
	//                 			if(error){
	//                              console.log("something goes wrong with the following error message " + error.reason )
	//           	  				Bert.alert(error.reason, 'danger');
	// 							e.target.value = cellInfo.original.units;
	// 						}
	// 					}
	// 				);
	// 		} else {
	// 			// e.target.value = cellInfo.original.units;
	// 		}
	// 	}
}

function editNativeUnits(currUnits, newUnits) {
	var message = "Edit Native Units\nFrom "
	message = message.concat(currUnits).concat(" to ").concat(newUnits);
	if(confirm(message)) {
		var success = false
// 		Meteor.call('editNativeUnits', 
// 			cellInfo.original.fullIng._id, 
// 			newUnits,  
// 			function(error,result){
//                 if(error){
//                     console.log("something goes wrong with the following error message " + error.reason )
//           	  		Bert.alert(error.reason, 'danger');
// 				}else {
// 					success = true
// 				}
// 			});

	}
	return success;
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
			   <option value = "sack">Sack (0.5 Sq. Ft.)</option>
			   <option value = "pail">Pail (1.5 Sq. Ft.)</option>
			   <option value = "drum">Drum (3 Sq. Ft.)</option>
			   <option value = "supersack">Supersack (16 Sq. Ft.)</option>
			   <option value = "truckload">Truckload (0 Sq. Ft.)</option>
			   <option value = "railcar">Railcar (0 Sq. Ft.)</option>
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
	{
		Header: 'Native Units Per Package',
		accessor: 'numNativeUnitsPerPackage',
		Cell: renderEditable,
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by Num of Native Units Per Pacakge"
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
		Header: 'Native Units',
		accessor: 'unit',
		Cell: renderEditableUnits,
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by units"
	      />
	}, 
	
	
	
];

export function convertToFrontend(ingredient, ingredientsList) {
	VendArray = new Array()
	ingredient.vendorInfo.forEach(function(info){
		var vendor = info.vendor;
		if(vendor != null && vendor._id != null && info.price != -1) {
			VendArray.push({_id: vendor._id, name: vendor.vendor, price: info.price});
		}
	});
	
	return {
			name: ingredient.name, 
			temp: ingredient.temperatureState, 
			pkg: ingredient.packageInfo.packageType, 
			numpkg: ingredient.packageInfo.numPackages,
			qty: ingredient.nativeInfo.totalQuantity,
			unit: ingredient.nativeInfo.nativeUnit, 
			numNativeUnitsPerPackage: ingredient.nativeInfo.numNativeUnitsPerPackage,
			vendors: VendArray,
			fullIng: ingredient
	}
}