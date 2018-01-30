import React, { Component } from 'react';

function renderEditable(cellInfo) {
	if(true) {
		return(<div style = {{ backgroudnColor: "#fafafa" }}
			contentEditable
			suppressContentEditableWarning
			onBlur = { e=> {
				if(cellInfo.column.id === 'name'){
					Meteor.call('editName', cellInfo.original.fullIng._id, e.target.innerHTML)
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

export const HeaderValues = [
	{
		Header: 'Name',
		accessor: 'name',
		Cell: renderEditable
	}, 
	{
		Header: 'Temperature State',
		accessor: 'temp',
		Cell: renderEditable
	}, 
	{
		Header: 'Packaging',
		accessor: 'pkg',
		Cell: renderEditable
	}, 
	{
		Header: 'Quantity (lbs)',
		accessor: 'qty',
		Cell: renderEditable
	}, 
];

export function convertToFrontend(ingredient, ingredientsList) {
	VendArray = new Array()
	// ingredient.vendors.forEach(function(vendor){

	// });
	
	VendArray.push({_id: 0, name: "Atlantic", cost: "$5.00"});
	VendArray.push({_id: 1, name: "Alliant", cost: "$4.00"});
	
	return {
			name: ingredient.name, 
			temp: ingredient.temperatureState, 
			pkg: ingredient.package, 
			qty: ingredient.quantity, 
			vendors: VendArray,
			fullIng: ingredient
	}
}