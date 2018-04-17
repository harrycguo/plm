import React, { Component } from 'react';


var boxLocked = false;

export const FinalProductsHeaderValues = [
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