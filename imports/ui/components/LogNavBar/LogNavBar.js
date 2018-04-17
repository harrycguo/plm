import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import ViewLog from '../../pages/ViewLog/ViewLog.js'
import { LinkContainer } from 'react-router-bootstrap'


class LogNavBar extends Component {
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
                                <NavDropdown eventKey="3" title="View Global Log" className="topTabClass">
                                    
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
                                    <LinkContainer to="/vendorManagement">
                                        <MenuItem eventKey="3.4">Vendor Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/userManagement">
                                        <MenuItem eventKey="3.5">User Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/reports">
                                        <MenuItem eventKey="3.10">View Reports</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>


                                </NavDropdown>
                                <NavItem eventKey="first">Log</NavItem>
                               

                            </Nav>
                        </Col>
                        <Col sm={12}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <ViewLog />
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
                                <NavDropdown eventKey="3" title="View Global Log" className="topTabClass">
                                    
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
                                    <LinkContainer to="/vendorManagement">
                                        <MenuItem eventKey="3.4">Vendor Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/userManagement">
                                        <MenuItem eventKey="3.5">User Management</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/reports">
                                        <MenuItem eventKey="3.10">View Reports</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>
                                    

                                    </NavDropdown>
                                    <NavItem eventKey="first">Log</NavItem>
                                   
    
                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <ViewLog />
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
                <p></p>
                <b>***User does not have permission to access this***</b>

                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="tabs">
                                <NavDropdown eventKey="3" title="View Global Log" className="topTabClass">
                                    
                                    <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">User Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="3.7">Logout</MenuItem>
                                    </LinkContainer>


                                    </NavDropdown>
                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>

        )
        

        }
    }
}

export default LogNavBar;





