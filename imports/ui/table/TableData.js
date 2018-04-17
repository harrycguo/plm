import React, { Component } from 'react';
import CustomNativeUnitsInput from '../forms/CustomNativeUnitInput.js'
import { Vendors } from '../../api/Vendors/vendors.js';


export var canEdit = false;
var nativeUnitSwitch = {cellInfo: null, target: null, toggled: false};
var boxLocked = false;
export function toggleEditable() {
	canEdit = !canEdit;
}

function renderEditable(cellInfo) {
	if(canEdit) {
		return(<input 
			type="text" 
			defaultValue={cellInfo.value}
			onChange = {e=> {
				boxLocked = false
			}}
			onBlur = {e => {
				if(!boxLocked) {
				e.persist()
				if(cellInfo.column.id === 'name'){	
					var message = "Edit Name\nFrom "
					message = message.concat(cellInfo.original.name).concat(" to ").concat(e.target.value);
					boxLocked = true;
					console.log(boxLocked)
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
					boxLocked = true;
					if(confirm(message)) {
						var entry = parseInt(e.target.value)
						if(entry >= 0) {
							Meteor.call('editTotalNumNativeUnits', cellInfo.original.fullIng._id, Number(entry),
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
				} else if (cellInfo.column.id === 'numNativeUnitsPerPackage') {
					var message = "Edit Number of Native Units Per Package\nFrom "
					message = message.concat(cellInfo.original.numNativeUnitsPerPackage).concat(" to ").concat(e.target.value);
					boxLocked = true;
					if(confirm(message)) {
						var entry = parseInt(e.target.value)
						if(entry >= 0) {
							Meteor.call('editNumNativeUnitsPerPackage', cellInfo.original.fullIng._id, entry,
								function(error,result){
	                   			if(error){
	                        		console.log("something goes wrong with the following error message " + error.reason )
	               	  				Bert.alert(error.reason, 'danger');
	                  			}
							});
						} else {
							Bert.alert('Must be greater than or equal to zero', 'danger');
							e.target.value = cellInfo.original.numNativeUnitsPerPackage;
						}
					} else {
						e.target.value = cellInfo.original.numNativeUnitsPerPackage;
					}
				}
				} else {
					boxLocked = false;
					if(cellInfo.column.id === 'name'){	
						e.target.value = cellInfo.original.name;
					} else if (cellInfo.column.id === 'qty') {
						e.target.value = cellInfo.original.qty;
					} else if (cellInfo.column.id === 'numNativeUnitsPerPackage') {
						e.target.value = cellInfo.original.numNativeUnitsPerPackage;
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

function renderCustomField(cellInfo) {
	var defVal = (cellInfo.original.unit == "Gallons" ||
						cellInfo.original.unit == "Pounds") ? "" : cellInfo.original.unit;
	return (
		<input
				type="text"
				ref={customNativeUnit => (this.customNativeUnit = customNativeUnit)}
				name="customNativeUnit"
				defaultValue={defVal}
				onChange = {e=> {
					boxLocked = false
				}}
				onBlur={ e => {
					if(!boxLocked) {
					var result = false;
					if(cellInfo === nativeUnitSwitch.cellInfo && nativeUnitSwitch.toggled) {
						console.log(cellInfo)
						console.log(nativeUnitSwitch)
						console.log(e.target.value)
						result = editNativeUnits(nativeUnitSwitch.target, cellInfo, cellInfo.value, e.target.value)
		
					} else if (cellInfo.original.unit != "Pounds" && cellInfo.original.unit != "Gallons"){
						result = editNativeUnits(e.target, cellInfo, cellInfo.value, e.target.value);
					}
					if(!result){
						e.target.value = (cellInfo.original.unit == "Gallons" ||
							cellInfo.original.unit == "Pounds") ? "" : cellInfo.original.unit;
					}
					} else {
						boxLocked = false;
						e.target.value = (cellInfo.original.unit == "Gallons" ||
							cellInfo.original.unit == "Pounds") ? "" : cellInfo.original.unit;
					}
				}}
				placeholder="Native Unit"
			/>
	)
}

function renderEditableUnits(cellInfo) {
	if(canEdit) {
		var defaultValue = cellInfo.value;
		if(defaultValue != "Gallons" && defaultValue != "Pounds"){
			defaultValue = "custom"
		}
		return (
			<span>
				<select
					ref={nativeUnit => (this.nativeUnit = nativeUnit)}
					name="nativeUnit"
					placeholder="Native Unit"
					defaultValue={defaultValue}
					onChange={ e => {
						nativeUnitSwitch.cellInfo = cellInfo;
						nativeUnitSwitch.target = e.target;
						if(e.target.value == "custom") {
							nativeUnitSwitch.toggled = true
						} else {
							nativeUnitSwitch.toggled = false
							var somevar = editNativeUnits(e.target, cellInfo, cellInfo.value, e.target.value)
						}
					}}
				>
					<option value="Pounds">Pounds</option>
					<option value="Gallons">Gallons</option>
					<option value="custom">Custom...</option>
				</select>
				{renderCustomField(cellInfo)}
			</span>
		)
	} else {
		return(<div style = {{ backgroundColor: "#ffffff" }}
			dangerouslySetInnerHTML={{
				__html: cellInfo.value
			}}
		/>);
	}
}

function editNativeUnits(target, cellInfo, currUnits, newUnits) {
	var message = "Edit Native Units\nFrom "
	message = message.concat(currUnits).concat(" to ").concat(newUnits);
	console.log(target)
	boxLocked = true
	if(confirm(message)) {
		var success = Meteor.call('editNativeUnit', 
			cellInfo.original.fullIng._id, 
			newUnits,
			function(error,result){
				if(error){
					console.log("something goes wrong with the following error message " + error.reason )
					Bert.alert(error.reason, 'danger');
					target.value = (cellInfo.original.unit == "Gallons" ||
						cellInfo.original.unit == "Pounds") ? cellInfo.original.unit : "custom";
				}
			});
	} else {
		target.value = (cellInfo.original.unit == "Gallons" ||
						cellInfo.original.unit == "Pounds") ? cellInfo.original.unit : "custom";
		if(target.value!="custom") {
			nativeUnitSwitch.toggled = false
		}
		return false
	}
	return true;
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
				boxLocked = true;
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
				boxLocked = true;
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
		Header: 'Storage',
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

export function convertToFrontend(ingredient, ingredientsList, vendors) {
	VendArray = new Array()
	ingredient.vendorInfo.forEach(function(info){
		var foundVendor = null;
		vendors.forEach(function(vendor) {
			if(vendor._id == info.vendor){
				foundVendor = vendor
			}
		})
		if(foundVendor != null) {
			VendArray.push({_id: foundVendor._id, name: foundVendor.vendor, price: info.price});
		}
	});
	
	var floorSpace = null
	switch(ingredient.packageInfo.packageType) {
        case "sack":
        	floorSpace = 0.5;
        	break;
        case "pail":
        	floorSpace = 1.5;
        	break;
        case "drum":
        	floorSpace = 3;
        	break;
        case "supersack":
        	floorSpace = 16;
        	break;
        case "truckload":
        case "railcar":
        	floorSpace = 0;
        	break;
	}
	var numPackagesWithFloorspace = floorSpace*ingredient.packageInfo.numPackages;
	numPackagesWithFloorspace = numPackagesWithFloorspace.toString().concat(" Sq. Ft. (").concat(ingredient.packageInfo.numPackages.toString()).concat(" pkg(s))")
	return {
			name: ingredient.name, 
			temp: ingredient.temperatureState, 
			pkg: ingredient.packageInfo.packageType, 
			numpkg: numPackagesWithFloorspace,
			qty: ingredient.nativeInfo.totalQuantity,
			unit: ingredient.nativeInfo.nativeUnit, 
			numNativeUnitsPerPackage: ingredient.nativeInfo.numNativeUnitsPerPackage,
			vendors: VendArray,
			fullIng: ingredient
	}
}
