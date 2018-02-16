import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class VendorManagementNavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="topContainer">

                <Link
                    className="container-nav"
                    to="/adminHomepage">
                    Admin Homepage
                            </Link>
                <Link
                    className="container-nav"
                    to="/vendorManagement">
                    Vendor Management
                            </Link>
                <Link
                    className="container-nav"
                    to="/addVendor">
                    Add Vendor
                            </Link>
            </div>
        );
    }
}

export default VendorManagementNavBar;





