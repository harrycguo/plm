import React, { Component } from 'react';

export const IntermediateHeaderValues = [
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
		Header: 'Temperature State',
		accessor: 'temp',
		//Cell: renderEditableDropdown,
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
		//Cell: renderEditableDropdown,
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
		//Cell: renderEditable,
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
		Header: 'Native Units',
		accessor: 'unit',
		//Cell: renderEditableUnits,
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
		Header: 'Quantity',
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
]

export const InProgressHeaderValues = [
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
		Header: 'Formula Name',
		accessor: 'formula',
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
		Header: 'Quantity',
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
		Header: 'Production Line',
		accessor: 'productionLine',
		//Cell: renderEditable,
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by production line"
	      />
	}, 
]