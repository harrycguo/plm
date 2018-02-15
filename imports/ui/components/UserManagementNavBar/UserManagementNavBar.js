import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class UserManagementNavBar extends Component {
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
                    to="/userManagement">
                    User Management
                            </Link>
                <Link
                    className="container-nav"
                    to="/createUser">
                    Create User
                            </Link>
            </div>
        );
    }
}

export default UserManagementNavBar;





