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
import RecallReportView from '../../pages/RecallReport/RecallReport.js'
import PendingOrders from '../../pages/PendingOrders/PendingOrders'

import Cart from '../../pages/Cart/Cart.js'
import { LinkContainer } from 'react-router-bootstrap'


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
                                    <NavDropdown eventKey="3" title="Inventory Management" className="topTabClass">
                                      
                                        <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">Admin Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/formulaManagement">
                                        <MenuItem eventKey="3.3">Formula Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/productionLineManagement">
                                        <MenuItem eventKey="3.11">Production Line Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/dni">
                                        <MenuItem eventKey="3.12">Distributor Network Inventory</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/vendorManagement">
                                        <MenuItem eventKey="3.4">Vendor Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/userManagement">
                                        <MenuItem eventKey="3.5">User Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/viewLog">
                                        <MenuItem eventKey="3.6">View Global Log</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/reports">
                                        <MenuItem eventKey="3.10">View Reports</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>


                                    </NavDropdown>
                                    <NavItem eventKey="1">Inventory</NavItem>
                                    <NavItem eventKey="2">Add New Ingredient</NavItem>
                                    <NavItem eventKey="4">Bulk Import</NavItem>
                                    <NavItem eventKey="5">Pending Orders</NavItem>


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
                                       <PendingOrders />
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
                                    <NavDropdown eventKey="3" title="Inventory Management" className="topTabClass">

                                        <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">Manager Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/formulaManagement">
                                        <MenuItem eventKey="3.3">Formula Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/productionLineManagement">
                                        <MenuItem eventKey="3.11">Production Line Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/dni">
                                        <MenuItem eventKey="3.12">Distributor Network Inventory</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/vendorManagement">
                                        <MenuItem eventKey="3.4">Vendor Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/userManagement">
                                        <MenuItem eventKey="3.5">User Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/viewLog">
                                        <MenuItem eventKey="3.6">View Global Log</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/reports">
                                        <MenuItem eventKey="3.10">View Reports</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>


                                    </NavDropdown>
                                    <NavItem eventKey="1">Inventory</NavItem>
                                    <NavItem eventKey="5">Pending Orders</NavItem>
                                   
                                  
                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <InventoryManagement hist = {this.props.hist} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="5">
                                        <PendingOrders />
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
                                <NavDropdown eventKey="3" title="Inventory Management" className="topTabClass">
                      
                                    <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">User Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/formulaManagement">
                                        <MenuItem eventKey="3.3">Formula Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/productionLineManagement">
                                        <MenuItem eventKey="3.11">Production Line Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/dni">
                                        <MenuItem eventKey="3.12">Distributor Network Inventory</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/vendorManagement">
                                        <MenuItem eventKey="3.4">Vendor Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/reports">
                                        <MenuItem eventKey="3.10">View Reports</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>


                                </NavDropdown>
                                <NavItem eventKey="1">Inventory</NavItem>
                               
                              
                            </Nav>
                        </Col>
                        <Col sm={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="1">
                                    <InventoryManagement hist = {this.props.hist} />
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





