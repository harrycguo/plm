import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import ViewLog from '../../pages/ViewLog/ViewLog.js'

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
                                <NavDropdown eventKey="3" title="Home + More" >
                                    <MenuItem eventKey="3.1"><Link to="/homepage"> Admin Homepage </Link></MenuItem>
                                    <MenuItem eventKey="3.2"><Link to="/inventoryManagement"> Inventory Management </Link></MenuItem>
                                    <MenuItem eventKey="3.3"><Link to="/formulaManagement"> Formula Management </Link></MenuItem>
                                    <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                    <MenuItem eventKey="3.5"><Link to="/userManagement"> User Management </Link></MenuItem>
                                    <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                </NavDropdown>
                                <NavItem eventKey="first">View Log</NavItem>
                               

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
                                <NavDropdown eventKey="3" title="Home + More" >
                                    <MenuItem eventKey="3.1"><Link to="/homepage"> Manager Homepage </Link></MenuItem>
                                    <MenuItem eventKey="3.2"><Link to="/inventoryManagement"> Inventory Management </Link></MenuItem>
                                    <MenuItem eventKey="3.3"><Link to="/formulaManagement"> Formula Management </Link></MenuItem>
                                    <MenuItem eventKey="3.4"><Link to="/vendorManagement"> Vendor Management </Link></MenuItem>
                                    <MenuItem eventKey="3.5"><Link to="/userManagement"> User Management </Link></MenuItem>
                                    <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                    </NavDropdown>
                                    <NavItem eventKey="first">View Log</NavItem>
                                   
    
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

                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="tabs">
                                <NavDropdown eventKey="3" title="Home + More" >
                                    <MenuItem eventKey="3.1"><Link to="/homepage"> User Homepage </Link></MenuItem>
                                    <MenuItem eventKey="3.2"><Link to="/inventoryManagement"> Inventory Management </Link></MenuItem>
                                    <MenuItem eventKey="3.3"><Link to="/formulaManagement"> Formula Management </Link></MenuItem>
                                    <MenuItem eventKey="3.7"><Link to="/logout"> Logout</Link></MenuItem>


                                    </NavDropdown>
                                    <NavItem eventKey="first">View Log</NavItem>
                                   
    
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
    }
}

export default LogNavBar;





