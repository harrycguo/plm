import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class VendorManagementNavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let user = Meteor.user();

        //admin
        if (Roles.userIsInRole(user, ['admin'])) {
            return (
                <div className="topContainer">

                    <Link
                        className="container-nav"
                        to="/homepage">
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
            )

        }

        //manager
        else if (Roles.userIsInRole(user, ['manager'])) {
            return (
                <div className="topContainer">

                <Link
                    className="container-nav"
                    to="/homepage">
                    Manager Homepage
                            </Link>
                <Link
                    className="container-nav"
                    to="/vendorManagement">
                    Vendor Management
                            </Link>
               
                </div>
            )

        }

        //user
        else {
            return (


                <div className="topContainer">

                <Link
                    className="container-nav"
                    to="/userHomepage">
                    User Homepage
                            </Link>
                <Link
                    className="container-nav"
                    to="/vendorManagement">
                    Vendor Management
                            </Link>
                
            </div>
            )

        }
    }
}

export default VendorManagementNavBar;





