import React, { Component } from 'react';

export var canEdit = false;

export var rolesMap = new Map();
rolesMap.set('admin', 'Administrator');
rolesMap.set('manager', 'Manager');
rolesMap.set('user', 'Unprivileged User');

export var revRolesMap = new Map();
revRolesMap.set('Administrator', 'admin');
revRolesMap.set('Manager', 'manager');
revRolesMap.set('Unprivileged User', 'user');


export function toggleEditable() {
	canEdit = !canEdit;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function renderEditableDropdown(cellInfo) {
    if(canEdit) {
        if(cellInfo.column.id === 'permissionLevelDisplay' && cellInfo.original.username != 'admin') {
            //Drop down menu with the three options
            return(
            <select 
            value = {cellInfo.original.permissionLevelDisplay}
            id = "selPermissionLevel" 
            ref="permissionLevel" 
            onChange={ e=> {
                if(confirm('Change Permission of User?')) {
                Meteor.call('editUserRole', 
                    cellInfo.original.fullUser, 
                    revRolesMap.get(e.target.value),
                    function(error,result){
                   		if(error){
               	  			Bert.alert(error.reason, 'danger');
                  		} else {
                            Bert.alert('Successfully Changed User Permission!', 'success')
                        }
                    });
                }
            }}
            >
               <option value = "Administrator">Administrator</option>
               <option value = "Manager">Manager</option>
               <option value = "Unprivileged User">Unprivileged User</option>
            </select>);			
        } else {
            return(
                <div>{cellInfo.original.permissionLevelDisplay}</div>
            )
            
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
    Header: 'Username',
    accessor: 'username',
    id: 'username',
    filterable: true,
    filterMethod: (filter, row, column) => {
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true
      },
    Filter: ({ filter, onChange }) =>
      <input
        type="text"
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%', height: '100%'}}
        value={filter ? filter.value : ''}
        placeholder="Filter by Username"
      />
  }, 
  {
    Header: 'Permission Level',
    accessor: 'permissionLevelDisplay',
    id: 'permissionLevelDisplay',
    filterable: true,
    filterMethod: (filter, row) => {
      if (filter.value === 'all') {
        return true;
      } else {
        return row[filter.id] === filter.value;
      }
    },
    Cell: renderEditableDropdown,
    Filter: ({ filter, onChange }) =>
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%', height: '100%'}}
        value={filter ? filter.value : 'all'}
      >
        <option value="all">All</option>
        <option value="Administrator">Administrators</option>
        <option value="Manager">Managers</option>
        <option value="Unprivileged User">Unprivileged Users</option>
      </select>,
  },
];