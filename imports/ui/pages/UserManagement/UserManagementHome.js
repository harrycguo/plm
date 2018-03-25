import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserManagementNavBar from '../../components/UserManagementNavBar/UserManagementNavBar.js'


class UserManagementHome extends Component {
  constructor(props) {
    super(props);
    
}

  render() {
    return (
      <div className="container">
        <header>
            <h1>User Management</h1>
        </header>
        
        <UserManagementNavBar />

      </div>
    );
  }
}

export default UserManagementHome;





