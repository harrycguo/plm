import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

// App component - represents the whole app
class UserManagement extends Component {
    constructor(props) {
        super(props);
        console.log("User = ")
        console.log(Meteor.user());
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>User Management</h1>
                </header>
                <div>
                <Navbar className="redFont">
                    <Navbar.Header className='redFont' >
                        <Navbar.Brand className='redFont'>
                        <a href="#home">React-Bootstrap</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <NavItem eventKey={1} href="#">
                            Link
                            </NavItem>
                    </Navbar>
  
                    </div>
                <ul>
                    <li><Link to='/login'>Login</Link></li>
                </ul>
            </div>
        );
    }
}

export default UserManagement;





