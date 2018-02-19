import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class FormulaManagementNavBar extends Component {
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
                    to="/formulaManagement">
                    Formula Management
                </Link>
                <Link
                    className="container-nav"
                    to="/addFormula">
                    Add New Formula
                </Link>
                <Link
                    className="container-nav"
                    to="/bulkImport">
                    Bulk Import Formula
                </Link>  
            </div>
        );
    }
}

export default FormulaManagementNavBar;





