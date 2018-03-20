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
                                    <NavItem eventKey="1">Formula Management</NavItem>
                                    <NavItem eventKey="2">Add New Formula</NavItem>
                                    <NavItem eventKey="4">Bulk Import Formula</NavItem>
                                    <NavItem eventKey="5">Produce Formula</NavItem>
                                    <NavItem eventKey="6">Production Report</NavItem>

                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <FormulaManagement />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <AddFormula />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="4">
                                        <BulkImportFormulas />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="5">
                                        <ProductionRun hist={this.props.hist} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="6">
                                        <ProductionReportPage />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>


                <div className="topContainer">

                <Link
                    className="container-nav"
                    to="/homepage">
                    Admin Homepage
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

        //manager
        else if (Roles.userIsInRole(user, ['manager'])) {
            return (
                <div className="topContainer">

                <Link
                    className="container-nav"
                    to="/homepage">
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
                    to="/homepage">
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





