import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';

class InventoryManagementNavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let user = Meteor.user()
        let carts = this.props.carts
        let cartNum = 0;

        for (let i = 0; i < carts.length; i++){
            if (carts[i].user == user._id){
                cartNum = carts[i].ingredients.length
            }
        }



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
                    to="/inventoryManagement">
                    Inventory Management
                </Link>

                <Link
                    className="container-nav"
                    to="/addingredient">
                    Add Ingredient
                </Link>

                <Link
                    className="container-nav"
                    to="/bulkImportIngredients">
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
                    Cart({cartNum})
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
                    to="/inventoryManagement">
                    Inventory Management
                </Link>

                <Link
                    className="container-nav"
                    to="/report">
                    Spending Report
                </Link>
             
                <Link
                    className="container-nav-right"
                    to="/cart">
                    Cart({cartNum})
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
                    to="/inventoryManagement">
                    Inventory Management
                </Link>

                <Link
                    className="container-nav"
                    to="/report">
                    Spending Report
                </Link>
   
            </div>
            )

        }

    }
}

export default withTracker(() => {
	Meteor.subscribe('carts');
	return {
		carts: Carts.find({}).fetch(),
	};
})(InventoryManagementNavBar)





