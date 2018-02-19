import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from '../../table/Table.js'
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
 
// App component - represents the whole app
class ManagerViewInventory extends Component {
  constructor(props) {
    super(props);
    
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Inventory</h1>
        </header>
        <li><Link to='/managerHomepage'>Manager Home</Link></li>
        <StorageCapacityWrapper/>
        <Table/>

      </div>
    );
  }
}

export default ManagerViewInventory;