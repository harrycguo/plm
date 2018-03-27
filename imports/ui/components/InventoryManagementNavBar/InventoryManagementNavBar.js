import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Carts from '../../../api/Cart/Cart.js';
import IngredientsList from '../../../api/Ingredients/IngredientList.js';
import { Vendors } from '../../../api/Vendors/vendors.js';

import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import InventoryManagement from '../../pages/InventoryManagement/InventoryManagement.js'
import AddIngredient from '../../pages/AddIngredient/AddIngredient.js'
import BulkImportIngredients from '../../pages/BulkImportIngredients/BulkImportIngredients.js'
import SpendingReport from '../../pages/SpendingReport/SpendingReport.js'
import FreshnessReport from '../../pages/FreshnessReport/FreshnessReport.js'
import RecallReport from '../../pages/RecallReport/RecallReport.js'
import Cart from '../../pages/Cart/Cart.js'

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

                <div>

                    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="1">
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    <NavDropdown eventKey="3" title="Home + More" >
                                        <MenuItem eventKey="3.1"><Link to="/homepage"> Admin Homepage </Link></MenuItem>
                                        <MenuItem eventKey="3.3"><Link to="/formulaManagement"> Formula Management </Link></MenuItem>
                                        <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                        <MenuItem eventKey="3.5"><Link to="/userManagement"> User Management </Link></MenuItem>
                                        <MenuItem eventKey="3.6"><Link to="/viewLog"> View Global Log </Link></MenuItem>
                                        <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                    </NavDropdown>
                                    <NavItem eventKey="1">Inventory Management</NavItem>
                                    <NavItem eventKey="2">Add New Ingredient</NavItem>
                                    <NavItem eventKey="4">Bulk Import Ingredients</NavItem>
                                    <NavItem eventKey="5">Spending Report</NavItem>
                                    <NavItem eventKey="9">Freshness Report</NavItem>
                                    <NavItem eventKey="10">Recall Report</NavItem>
                                  
                                    

                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <InventoryManagement hist = {this.props.hist} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <AddIngredient />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="4">
                                        <BulkImportIngredients />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="5">
                                        <SpendingReport />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="9">
                                        <FreshnessReport />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="10">
                                        <RecallReport />
                                    </Tab.Pane>
                                   
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>


             
            )

        }

        //manager
        else if (Roles.userIsInRole(user, ['manager'])) {
            return (
                 <div>

                    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="1">
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    <NavDropdown eventKey="3" title="Home + More" >
                                        <MenuItem eventKey="3.1"><Link to="/homepage"> Manager Homepage </Link></MenuItem>
                                        <MenuItem eventKey="3.3"><Link to="/formulaManagement"> Formula Management </Link></MenuItem>
                                        <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                        <MenuItem eventKey="3.5"><Link to="/userManagement"> User Management </Link></MenuItem>
                                        <MenuItem eventKey="3.6"><Link to="/viewLog"> View Global Log </Link></MenuItem>
                                        <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                    </NavDropdown>
                                    <NavItem eventKey="1">Inventory Management</NavItem>
                                    <NavItem eventKey="5">Spending Report</NavItem>
                                    <NavItem eventKey="9">Freshness Report</NavItem>
                                    <NavItem eventKey="10">Recall Report</NavItem>
                                  
                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <InventoryManagement hist = {this.props.hist} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="5">
                                        <SpendingReport />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="9">
                                        <FreshnessReport />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="10">
                                    <RecallReport />
                                    </Tab.Pane>
                                   
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            )

        }

        //user
        else {
            return (
                <div>

                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="1">
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="tabs">
                                <NavDropdown eventKey="3" title="Home + More" >
                                    <MenuItem eventKey="3.1"><Link to="/homepage"> User Homepage </Link></MenuItem>
                                    <MenuItem eventKey="3.3"><Link to="/formulaManagement"> Formula Management </Link></MenuItem>
                                    <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                    <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                </NavDropdown>
                                <NavItem eventKey="1">Inventory Management</NavItem>
                                <NavItem eventKey="5">Spending Report</NavItem>
                                <NavItem eventKey="9">Freshness Report</NavItem>
                                <NavItem eventKey="10">Recall Report</NavItem>
                              
                            </Nav>
                        </Col>
                        <Col sm={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="1">
                                    <InventoryManagement hist = {this.props.hist} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="5">
                                    <SpendingReport />
                                </Tab.Pane>
                                <Tab.Pane eventKey="9">
                                        <FreshnessReport />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="10">
                                    <RecallReport />
                                    </Tab.Pane>
                               
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
            )

        }

    }
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	Meteor.subscribe('vendors')
	Meteor.subscribe('carts');
	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
		carts: Carts.find({}).fetch(),
	};
})(InventoryManagementNavBar);





