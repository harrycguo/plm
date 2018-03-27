import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import FormulaManagement from '../../pages/FormulaManagement/FormulaManagement.js'
import AddFormula from '../../pages/AddFormula/AddFormula.js'
import BulkImportFormulasHome from '../../pages/BulkImportFormulas/BulkImportFormulasHome.js'
import ProductionRun from '../../pages/ProductionRun/ProductionRun.js'
import ProductionReportPageHome from '../../pages/ProductionReportPage/ProductionReportPageHome.js'
import IntermediatesDatabase from '../../pages/IntermediatesDatabase/IntermediatesDatabase.js'

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
                                    <NavDropdown eventKey="3" title="Home + More" >
                                        <MenuItem eventKey="3.1"><Link to="/homepage"> Admin Homepage </Link></MenuItem>
                                        <MenuItem eventKey="3.2"><Link to="/inventoryManagement"> Inventory Management </Link></MenuItem>
                                        <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                        <MenuItem eventKey="3.5"><Link to="/userManagement"> User Management </Link></MenuItem>
                                        <MenuItem eventKey="3.6"><Link to="/viewLog"> View Global Log </Link></MenuItem>
                                        <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                    </NavDropdown>
                                    <NavItem eventKey="1">Formula Management</NavItem>
                                    <NavItem eventKey="7">Formula Database</NavItem>
                                    <NavItem eventKey="2">Add New Formula</NavItem>
                                    <NavItem eventKey="4">Bulk Import Formula</NavItem>
                                    <NavItem eventKey="5">Produce Formula</NavItem>
                                    <NavItem eventKey="6">Reports</NavItem>

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
                                        <ProductionReportPageHome hist={this.props.hist}/>
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
                                        <MenuItem eventKey="3.2"><Link to="/inventoryManagement"> Inventory Management </Link></MenuItem>
                                        <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                        <MenuItem eventKey="3.5"><Link to="/userManagement"> User Management </Link></MenuItem>
                                        <MenuItem eventKey="3.6"><Link to="/viewLog"> View Global Log </Link></MenuItem>
                                        <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                    </NavDropdown>
                                    <NavItem eventKey="1">Formula Management</NavItem>
                                    <NavItem eventKey="7">Formula Database</NavItem>
                                    <NavItem eventKey="5">Produce Formula</NavItem>
                                    <NavItem eventKey="6">Reports</NavItem>

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
                                        <ProductionReportPageHome hist={this.props.hist}/>
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
                                        <MenuItem eventKey="3.2"><Link to="/inventoryManagement"> Inventory Management </Link></MenuItem>
                                        <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                        <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>

                                    </NavDropdown>
                                    <NavItem eventKey="1">Formula Management</NavItem>
                                    <NavItem eventKey="7">Formula Database</NavItem>
                                    <NavItem eventKey="6">Reports</NavItem>

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
                                        <ProductionReportPageHome hist={this.props.hist}/>
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





