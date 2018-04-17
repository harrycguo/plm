import React, { Component } from 'react';
import CustomNativeUnitsInput from '../forms/CustomNativeUnitInput.js'
import { Vendors } from '../../api/Vendors/vendors.js';
import TableData from './TableData.js';
var boxLocked = false;

function renderEditableVendor(cellInfo) {
	console.log(cellInfo)
	if(cellInfo.original.ingredient.vendorInfo == undefined) {
		return (<div>Formula</div>)
	}
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

function renderEditable(cellInfo) {
	if(TableData.canEdit) {
		return(<input 
			type="text" 
			defaultValue={cellInfo.value}
			onChange = {e=> {
				boxLocked = false
			}}
			onBlur = {e => {
				console.log(cellInfo)
				if(!boxLocked) {
				e.persist()
				if(cellInfo.column.id === 'num'){	
					var message = "Edit Lot Number\nFrom "
					message = message.concat(cellInfo.original.num).concat(" to ").concat(e.target.value);
					boxLocked = true;
					console.log(boxLocked)
					if(confirm(message)) {
						Meteor.call('lots.editLotNumber', 
							cellInfo.original.ingredient._id,
							cellInfo.original.num, 
							e.target.value,
							new Date(cellInfo.original.time),
							function(error,result){
	                   			if(error){
	                        		console.log("something goes wrong with the following error message " + error.reason )
	               	  				Bert.alert(error.reason, 'danger');
									e.target.value = cellInfo.original.num;
								}
							}
						);
					} else {
						e.target.value = cellInfo.original.num;
					}
				} else if (cellInfo.column.id === 'qty') {
					var message = "Edit Quantity\nFrom "
					message = message.concat(cellInfo.original.qty).concat(" to ").concat(e.target.value);
					boxLocked = true;
					if(confirm(message)) {
						var entry = parseInt(e.target.value)
						if(entry >= 0) {
							Meteor.call('lots.editLotQty', 
								cellInfo.original.ingredient._id, 
								cellInfo.original.num,
								e.target.value,
								new Date(cellInfo.original.time),
								function(error,result){
	                   			if(error){
	                        		console.log("something goes wrong with the following error message " + error.reason )
	               	  				Bert.alert(error.reason, 'danger');
									e.target.value = cellInfo.original.qty;
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
				} else {
					boxLocked = false;
					if(cellInfo.column.id === 'num'){	
						e.target.value = cellInfo.original.num;
					} else if (cellInfo.column.id === 'qty') {
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
export const HeaderValues = [ 
	{
		Header: "Expand",
		columns: [
			{
          expander: row => { return false },
          Header: () => <strong>More</strong>,
          width: 65,
          Expander: ({ isExpanded, ...rest }) =>
            <div>
              {isExpanded
                ? <span>&#x2299;</span>
                : <span>&#x2295;</span>}
            </div>,
          style: {
            cursor: "pointer",
            fontSize: 25,
            padding: "0",
            textAlign: "center",
            userSelect: "none"
          },
          Footer: () => <span>&hearts;</span>
        }
      ]
	},
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
	        placeholder="Filter by lot number"
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
	        placeholder="Filter by price"
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
	        placeholder="Filter by Time"
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
