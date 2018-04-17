import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import FormulaManagement from '../../pages/FormulaManagement/FormulaManagement.js'
import AddFormula from '../../pages/AddFormula/AddFormula.js'
import BulkImportFormulasHome from '../../pages/BulkImportFormulas/BulkImportFormulasHome.js'
import ProductionRun from '../../pages/ProductionRun/ProductionRun.js'
import ProductionHistoryPage from '../../pages/ProductionReportPage/ProductionHistoryPage.js'
import IntermediatesDatabase from '../../pages/IntermediatesDatabase/IntermediatesDatabase.js'
import DNIView from '../../pages/DistributorNetworkInventory/DNIView.js'
import { LinkContainer } from 'react-router-bootstrap'
import LineStatuses from '../../pages/LineStatuses/LineStatuses.js'


class FormulaManagementNavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let user = Meteor.user();

        //admin
        if (Roles.userIsInRole(user, ['admin'])) {
            return (
                <div>

                    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="1">
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    <NavDropdown eventKey="3" title="Formula Management" className="topTabClass">
                                    <LinkContainer to="homepage">
                                        <MenuItem eventKey="3.1">Admin Homepage</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/inventoryManagement">
                                        <MenuItem eventKey="3.2">Inventory Management</MenuItem>
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
                                    <NavItem eventKey="1">Database</NavItem>
                                    <NavItem eventKey="7">Inventory</NavItem>
                                    <NavItem eventKey="2">Add New Formula</NavItem>
                                    <NavItem eventKey="4">Bulk Import</NavItem>
                                    <NavItem eventKey="5">Produce Formula</NavItem>
                                    <NavItem eventKey="9">Line Statuses</NavItem>
                                    <NavItem eventKey="6">Production History</NavItem>
                                  


                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <FormulaManagement hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="7">
                                        <IntermediatesDatabase hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <AddFormula hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="4">
                                        <BulkImportFormulasHome hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="5">
                                        <ProductionRun hist={this.props.hist} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="6">
                                        <ProductionHistoryPage hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="8">
                                        <DNIView hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="9">
                                        <LineStatuses hist={this.props.hist}/>
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
                                    <NavDropdown eventKey="3" title="Formula Management" className="topTabClass">

                                        <LinkContainer to="homepage">
                                            <MenuItem eventKey="3.1">Manager Homepage</MenuItem>
                                        </LinkContainer>
                                        <LinkContainer to="/inventoryManagement">
                                            <MenuItem eventKey="3.2">Inventory Management</MenuItem>
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
                                    <NavItem eventKey="1">Database</NavItem>
                                    <NavItem eventKey="7">Inventory</NavItem>
                                    <NavItem eventKey="5">Produce Formula</NavItem>
                                    <NavItem eventKey="9">Line Statuses</NavItem>
                                    <NavItem eventKey="6">Production History</NavItem>

                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <FormulaManagement hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="7">
                                        <IntermediatesDatabase hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="5">
                                        <ProductionRun hist={this.props.hist} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="6">
                                        <ProductionHistoryPage hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="8">
                                        <DNIView hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="9">
                                        <LineStatuses hist={this.props.hist}/>
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
                                    <NavDropdown eventKey="3" title="Formula Management" className="topTabClass">

                                        <LinkContainer to="homepage">
                                            <MenuItem eventKey="3.1">User Homepage</MenuItem>
                                        </LinkContainer>
                                        <LinkContainer to="/inventoryManagement">
                                            <MenuItem eventKey="3.2">Inventory Management</MenuItem>
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
                                    <NavItem eventKey="1">Database</NavItem>
                                    <NavItem eventKey="7">Inventory</NavItem>
                                    <NavItem eventKey="9">Line Statuses</NavItem>
                                    <NavItem eventKey="6">Production History</NavItem>

                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <FormulaManagement hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="7">
                                        <IntermediatesDatabase hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="6">
                                        <ProductionHistoryPage hist={this.props.hist}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="9">
                                        <LineStatuses hist={this.props.hist}/>
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

export default FormulaManagementNavBar;





