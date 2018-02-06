import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
 
// App component - represents the whole app
class UserHomepage extends Component {
  constructor(props) {
    super(props);
  
    
  }
 
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>User Homepage</h1>
        </header>

        <li><Link to='/userViewInventory'>View Inventory</Link></li>
        <li><Link to='/logout'>Logout</Link></li>
      </div>
    );
  }
}

export default UserHomepage;