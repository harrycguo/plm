import React, { Component } from 'react';
import CustomNativeUnitsInput from '../forms/CustomNativeUnitInput.js'
import { Vendors } from '../../api/Vendors/vendors.js';
import TableData from './TableData.js';
var boxLocked = false;

function renderEditableVendor(cellInfo) {
	console.log(cellInfo)
	if(TableData.canEdit) {
		var vendors = cellInfo.original.ingredient.vendorInfo;
		var oldVendorId = cellInfo.original.vendorID
		let items = new Array();
		vendors.forEach(function (vendor) {
			var fullVendor = Vendors.find({_id: vendor.vendor}).fetch()[0]
			var vendorName = fullVendor != undefined ? fullVendor.vendor : ""
			console.log(vendorName)
			if(vendor.vendor == oldVendorId) {
				items.push(
					<option selected="selected" key={vendor.vendor} value={vendor.vendor}>
						{vendorName + ' | ' + Number(vendor.price.toFixed(2))}
					</option>
				)
			} else {
				items.push(
					<option key={vendor.vendor} value={vendor.vendor}>
						{vendorName + ' | ' + Number(vendor.price.toFixed(2))}
					</option>
				)
			}
		})

		return (
			<p><select
				name="vendor"
				ref={vendor => (this.vendor = vendor)}
				onChange={e=> {
					console.log("Swap vendor name")
				}}
			>
				{items}
			</select></p>
		)
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

function renderEditable(cellInfo){
	return(
		<div 
			style = {{ backgroundColor: "#ffffff" }}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value
			}}
		/>
	);
}

export const HeaderValues = [
	{
		Header: 'Lot Number',
		accessor: 'num',
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
		Header: 'Quantity',
		accessor: 'qty',
		Cell: renderEditable,
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
		Header: 'Vendor',
		accessor: 'vendor',
		Cell: renderEditableVendor,
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
		Header: 'Price',
		accessor: 'price',
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
		Header: 'Lot Time',
		accessor: 'time',
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by Num of Native Units Per Pacakge"
	      />
	}, 
];

export function convertToFrontend(lot, ingredient, vendors) {
	var vendorName = lot.vendor
	vendors.forEach(function (vendor) {
		console.log(vendor)
		if(vendor._id == lot.vendor) {
			vendorName = vendor.vendor
		}
	})

	return {
		num: lot.lot, 
		qty: lot.qty,
		vendor: vendorName,
		vendorID: lot.vendor,
		price: lot.price,
		time: lot.time.toString(),
		ingredient: ingredient
	}
}
