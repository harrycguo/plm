import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class AdminViewInventoryNavBar extends Component {
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
                    to="/adminViewInventory">
                    Inventory Management
                </Link>
                <Link
                    className="container-nav"
                    to="/addingredient">
                    Add Ingredient
                </Link>
                <Link
                    className="container-nav"
                    to="/bulkImport">
                    Bulk Import Ingredients
                </Link>
                <Link
                    className="container-nav"
                    to="/report">
                    Spending Report
                </Link>
             
                <Link
                    className="container-nav-right"
                    to="/cart">
                    Cart
                </Link>    
            </div>
        );
    }
}

export default AdminViewInventoryNavBar;





