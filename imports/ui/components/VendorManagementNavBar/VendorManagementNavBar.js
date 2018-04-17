import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import AddVendor from '../../pages/AddVendor/AddVendor.js'
import VendorManagement from '../../pages/VendorManagement/VendorManagement.js'
import { LinkContainer } from 'react-router-bootstrap'


class VendorManagementNavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let user = Meteor.user();

        //admin
        if (Roles.userIsInRole(user, ['admin'])) {
            return (

                <div>

                    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    <NavDropdown eventKey="3" title="Vendor Management" className="topTabClass">
                                     

                                        <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">Admin Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/inventoryManagement">
                                        <MenuItem eventKey="3.2">Inventory Management</MenuItem>
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
                                    <NavItem eventKey="first">Vendors</NavItem>
                                    <NavItem eventKey="second">Add Vendor</NavItem>

                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <VendorManagement />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <AddVendor />
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

                    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    <NavDropdown eventKey="3" title="Vendor Management" className="topTabClass">
                                       

                                        <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">Manager Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/inventoryManagement">
                                        <MenuItem eventKey="3.2">Inventory Management</MenuItem>
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
                                    <NavItem eventKey="first">Vendors</NavItem>


                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <VendorManagement />
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

                    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    <NavDropdown eventKey="3" title="Vendor Management" className="topTabClass">
                                  
                                        <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">User Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/inventoryManagement">
                                        <MenuItem eventKey="3.2">Inventory Management</MenuItem>
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
                                    <LinkContainer to="/reports">
                                        <MenuItem eventKey="3.10">View Reports</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>


                                    </NavDropdown>
                                    <NavItem eventKey="first">Vendors</NavItem>


                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <VendorManagement />
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

export default VendorManagementNavBar;





