import React, { Component } from 'react';

export var editModeOn = false;

export function toggleEditable() {
	editModeOn = !editModeOn;
}

function renderEditable(cellInfo) {
	if(editModeOn) {
		return(<div style = {{ backgroudnColor: "#fafafa" }}
			contentEditable
			suppressContentEditableWarning
			onBlur = { e => {
				if(cellInfo.column.id === 'name'){
					Meteor.call('editName', cellInfo.original.fullIng._id, e.target.innerHTML)
				} else if (cellInfo.column.id === 'amt') {
					// Meteor.call('')
				}
			}}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value
			}}
		/>);
	} else {
		return(<div style = {{ backgroudnColor: "#fafafa" }}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value
			}}
		/>);
	}
}

function renderEditableDropdown(cellInfo) {
	if(editModeOn) {
		if(cellInfo.column.id === 'temp') {
			//Drop down menu with the three options
			return(
			<select 
			value = { cellInfo.original.temp }
			id = "selTemperatureState" 
			ref="temperatureState" 
			onChange={ e=> {
				Meteor.call('editTemperatureState', cellInfo.original.fullIng._id, e.target.value)
			}}
			>
			   <option value = "Frozen">Frozen</option>
			   <option value = "Room Temperature">Room Temperature</option>
			   <option value = "Refrigerated">Refrigerated</option>
			</select>);			
		} else if(cellInfo.column.id === 'pkg') {
			// Same as above but with packaging options
			return(
			<select 
			id = "selPackaging" 
			ref="packaging"
			value = {cellInfo.original.pkg}
			onChange={ e=> {
				Meteor.call('editPackage', cellInfo.original.fullIng._id, e.target.value)
			}}
			>
			   <option value = "Sack">Sack (50 lbs)</option>
			   <option value = "Pail">Pail (50 lbs)</option>
			   <option value = "Drum">Drum (500 lbs)</option>
			   <option value = "Supersack">Supersack (2000 lbs)</option>
			   <option value = "Truckload">Truckload (50000)</option>
			   <option value = "Railcar">Railcar (280000)</option>
			</select>);
		}
		
	} else {
		return(<div style = {{ backgroudnColor: "#fafafa" }}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value
			}}
		/>);
	}
}

export const HeaderValues = [
	{
		Header: 'Name',
		accessor: 'name',
		Cell: renderEditable
	}, 
	{
		Header: 'Temperature State',
		accessor: 'temp',
		Cell: renderEditableDropdown
	}, 
	{
		Header: 'Packaging',
		accessor: 'pkg',
		Cell: renderEditableDropdown
	}, 
	{
		Header: 'Amount',
		accessor: 'amt',
		Cell: renderEditable
	},
	{
		Header: 'Quantity (lbs)',
		accessor: 'qty',
	}, 
];

export function convertToFrontend(ingredient, ingredientsList) {
	VendArray = new Array()
	// ingredient.vendors.forEach(function(vendor){

	// });
	
	VendArray.push({_id: 0, name: "Atlantic", cost: "$5.00"});
	VendArray.push({_id: 1, name: "Alliant", cost: "$4.00"});
	// console.log(ingredient)
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