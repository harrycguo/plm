import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from '../../table/Table.js'
import StorageCapacityWrapperNonEdit from '../../components/StorageCapacityWrapper/StorageCapacityWrapperNonEdit.js'
 
// App component - represents the whole app
class UserViewInventory extends Component {
  constructor(props) {
    super(props);
    
    console.log("User = ")
    console.log(Meteor.user());
    
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Inventory</h1>
        </header>
        <li><Link to='/userHomepage'>User Home</Link></li>
        <li><Link to='/addingredient'>Order Ingredient</Link></li>
        <StorageCapacityWrapperNonEdit/>
        <Table/>

      </div>
    );
  }
}

export default UserViewInventory;