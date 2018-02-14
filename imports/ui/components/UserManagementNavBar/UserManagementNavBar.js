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
            <div className="containerNone">
                <Navbar className="containerNone" >
                    <Nav className="containerNone" >

                        <NavItem className="containerNone">
                            <Link to="/adminHomepage">
                                Admin Homepage
                            </Link>
                        </NavItem>


                        <NavItem className="containerNone">
                            <Link to="/userManagement">
                                User Management
                            </Link>
                        </NavItem>

                        <NavItem className="containerNone">
                            <Link to="/createUser">
                                Create User
                            </Link>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default UserManagementNavBar;





