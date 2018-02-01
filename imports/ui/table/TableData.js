import React, { Component } from 'react';

export var canEdit = false;

export function toggleEditable() {
	canEdit = !canEdit;
}

function renderEditable(cellInfo) {
	if(canEdit) {
		return(<div style = {{ backgroudnColor: "#fafafa" }}
			contentEditable
			suppressContentEditableWarning
			onBlur = { e => {
				if(cellInfo.column.id === 'name'){
					Meteor.call('editName', cellInfo.original.fullIng._id, e.target.innerHTML)
				} else if (cellInfo.column.id === 'amt') {
					var entry = parseInt(e.target.innerHTML)
					if(entry >= 0) {
						Meteor.call('editNumPackages', cellInfo.original.fullIng._id, entry)
					}
					e.target.innerHTML = cellInfo.original.amt
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
	if(canEdit) {
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
			   <option value = "frozen">Frozen</option>
			   <option value = "room temperature">Room Temperature</option>
			   <option value = "refrigerated">Refrigerated</option>
			</select>);			
		} else if(cellInfo.column.id === 'pkg') {
			// Same as above but with packaging options
			return(
			<select 
			id = "selPackaging" 
			ref="packaging"
			value = {cellInfo.original.pkg.toLowerCase()}
			onChange={ e=> {
				Meteor.call('editPackage', cellInfo.original.fullIng._id, e.target.value)
			}}
			>
			   <option value = "sack">Sack (50 lbs)</option>
			   <option value = "pail">Pail (50 lbs)</option>
			   <option value = "drum">Drum (500 lbs)</option>
			   <option value = "supersack">Supersack (2000 lbs)</option>
			   <option value = "truckload">Truckload (50000)</option>
			   <option value = "railcar">Railcar (280000)</option>
			</select>);
		}
		
	} else {
		return(<div style = {{ backgroudnColor: "#fafafa" }}
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
	ingredient.vendors.forEach(function(vendor){
		if(vendor != null && vendor._id != null) {
			var price = -1;
			ingredient.prices.forEach(function(priceElement) {
				if(priceElement.vendorId == vendor._id) {
					price = priceElement.vendorPrice;
				}
			})
			if(price != -1) {
				VendArray.push({_id: vendor._id, name: vendor.vendor, cost: price});
			}
		}
	});
	
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