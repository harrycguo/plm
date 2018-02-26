import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import UserManagementNavBar from '../../components/UserManagementNavBar/UserManagementNavBar.js'
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import UserManagementData from './UserManagementData.js'
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../../../api/Users/users.js'

// App component - represents the whole app
class UserManagement extends Component {
    constructor(props) {
        super(props);
    }

    edit() {
		UserManagementData.toggleEditable()
		this.forceUpdate()
	}

    renderUserTable() {

        let users = Meteor.users.find({}).fetch()
        let data = new Array();

        for (let i = 0; i < users.length; i++){
            data.push({
                username: users[i].username,
                permissionLevel: users[i].roles[0],
                permissionLevelDisplay: UserManagementData.rolesMap.get(users[i].roles[0]),
                fullUser: users[i]
            })
        }
        
        return (
            <ReactTable
                data={data}
                columns={UserManagementData.HeaderValues}
                noDataText="Loading..." 
            />
        )
    }

    render() {

        let buttonText = UserManagementData.canEdit ? "Finished Editing" : "Edit User Permissions"

        let user = Meteor.user();
        let button = null

        //admin
        if (Roles.userIsInRole(user, ['admin'])) {
            button = <Button bsStyle="primary"
            onClick={this.edit.bind(this)}
            title= "Edit"
            >{buttonText}</Button>
        } else {
            button = <div className="containerNone"></div>
        }


        return (
            <div className="container">
                <header>
                    <h1>User Management</h1>
                </header>
                <UserManagementNavBar/>
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
	Meteor.subscribe('users')
	return {
		users: Meteor.users.find({}).fetch()
	};
})(UserManagement);










