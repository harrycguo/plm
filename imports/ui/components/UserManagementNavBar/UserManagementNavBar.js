import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class UserManagementNavBar extends Component {
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
            )

        }

        //manager
        else if (Roles.userIsInRole(user, ['manager'])) {
            return (
                <div className="topContainer">
                    <Link
                        className="container-nav"
                        to="/managerHomepage">
                        Manager Homepage
                    </Link>
                    <Link
                        className="container-nav"
                        to="/userManagement">
                        User Management
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
                        to="/managerHomepage">
                        Manager Homepage
                    </Link>
                    <Link
                        className="container-nav"
                        to="/userManagement">
                        User Management
                    </Link>
                </div>
            )

        }
    }
}

export default UserManagementNavBar;





