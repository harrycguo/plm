import React, { Component } from 'react';


var boxLocked = false;

export const FinalProductsHeaderValues = [
	{
		Header: 'Name',
		accessor: 'name',
		//Cell: renderEditable,
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
		Header: 'Available Quantity',
		accessor: 'qty',
		//Cell: renderEditable,
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
		Header: 'Sale Quantity',
		accessor: 'tosell',
	},
	{
		Header: 'Wholesale Price',
		accessor: 'price',
	}
];