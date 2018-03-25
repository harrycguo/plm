import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from '../../table/Table.js'
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'

class InventoryManagement extends Component {
  constructor(props) {
    super(props);
    
  }
 
  render() {
    return (
      <div>
        <StorageCapacityWrapper hist = {this.props.hist}/>
        <Table hist = {this.props.hist} />
      </div>
    );
  }
}

export default InventoryManagement;