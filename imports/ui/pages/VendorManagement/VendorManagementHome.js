import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VendorManagementNavBar from '../../components/VendorManagementNavBar/VendorManagementNavBar.js'

class VendorManagementHome extends Component {
  constructor(props) {
    super(props);
}

  render() {
    return (
      <div className="container">
        <header>
            <h1>Vendor Management</h1>
        </header>
        
        <VendorManagementNavBar />

      </div>
    );
  }
}

export default VendorManagementHome;





