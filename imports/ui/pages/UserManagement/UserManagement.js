import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Row, Col, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import UserManagementNavBar from '../../components/UserManagementNavBar/UserManagementNavBar.js'
import ReactTable from 'react-table';
import { Button, ButtonToolbar } from 'react-bootstrap';
import UserManagementData from './UserManagementData.js'
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../../../api/Users/users.js'
import CreateUser from '../CreateUser/CreateUser.js'

class UserManagement extends Component {
    constructor(props) {
        super(props);
    }

    edit() {
        UserManagementData.toggleEditable()
        this.forceUpdate()
    }

    deleteUser(row) {
        if (confirm("Delete this User?")) {
            Meteor.call('users.deleteUser', row.original.fullUser._id, row.original.username)
        }
    }

    renderUserTable() {
        
        let users = Meteor.users.find({}).fetch()
        let data = new Array();

        for (let i = 0; i < users.length; i++) {
            if (users[i].roles == undefined) {
                data.push({
                    username: users[i].username,
                    permissionLevel: 'admin',
                    permissionLevelDisplay: UserManagementData.rolesMap.get('admin'),
                    fullUser: users[i]
                })

            } else {
            data.push({
                username: users[i].username,
                permissionLevel: users[i].roles[0],
                permissionLevelDisplay: UserManagementData.rolesMap.get(users[i].roles[0]),
                fullUser: users[i]
            })}
        }
     
        return (
            
            <ReactTable
                data={data}
                columns={UserManagementData.HeaderValues}
                noDataText="Loading..."
                SubComponent={row => {

                    return UserManagementData.canEdit && row.original.username != 'admin' ? (
                        <div className="container-nav">
                            <ButtonToolbar>
                                <Button
                                    bsStyle="danger"
                                    onClick={() => this.deleteUser(row)}
                                >
                                    Delete User
                            </Button>
                            </ButtonToolbar>

                        </div>

                    ) : null
                }}
            />
        )
    
    }

    render() {

        let buttonText = UserManagementData.canEdit ? "Finished Editing" : "Edit Users"

        let user = Meteor.user();
        let button = null

        //admin
        if (Roles.userIsInRole(user, ['admin'])) {
            button = <Button bsStyle="primary"
                onClick={this.edit.bind(this)}
                title="Edit"
            >{buttonText}</Button>
        } else {
            button = <div className="containerNone"></div>
        }

        return (
            <div>
                <p></p>
                <p><b>Administrator:</b>
                    <br></br>
                    A user with the “administrator permission” has all manager
                rights plus the ability to override system rules to directly correct data, input new ingredients
                and formulas, and perform other core configuration operations.
                </p>

                <p><b>Manager:</b>
                    <br></br>
                    A user with with the “manager permission” is able to order ingredients and
                perform production runs.</p>

                <p><b>Unprivileged User:</b>
                    <br></br>
                    A user with neither of the above two permissions. Still able to read
                inventory status, read reports, etc.</p>

                <p></p>
                    {button}
                <p></p>

                {this.renderUserTable()}
            </div>
        );
    }
}

export default withTracker(() => {
    const subscription = Meteor.subscribe('users')
    return {
        loading: subscription.ready(),
        users: Meteor.users.find({}).fetch()
    };
})(UserManagement);










