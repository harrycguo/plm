import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from '../../table/Table.js'
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
import AdminViewInventoryNavBar from '../../components/AdminViewInventoryNavBar/AdminViewInventoryNavBar.js'
 
// App component - represents the whole app
class AdminViewInventory extends Component {
  constructor(props) {
    super(props);
    
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Inventory Management</h1>
        </header>
        <AdminViewInventoryNavBar/>
        <StorageCapacityWrapper/>
        <Table/>

      </div>
    );
  }
}

export default AdminViewInventory;