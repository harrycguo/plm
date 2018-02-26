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
      <div className="container">
        <header>
          <h1>Inventory Management</h1>
        </header>
        <InventoryManagementNavBar/>
        <StorageCapacityWrapper/>
        <Table hist = {this.props} />

      </div>
    );
  }
}

export default InventoryManagement;