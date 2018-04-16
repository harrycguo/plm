import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base'
import UserManagementNavBar from '../../components/UserManagementNavBar/UserManagementNavBar.js'

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
          email: true,
        },
        username: {
          required: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
        permissionLevel: {
          required: true,
        },
      },
      messages: {
        firstName: {
          required: 'Input First Name',
        },
        lastName: {
          required: 'Input Last Name',
        },
        emailAddress: {
          required: 'Input Email Address',
          email: 'Incorrect Email Format',
        },
        username: {
          require: 'Input a Username'
        },
        password: {
          required: 'Need a password here.',
          minlength: 'Please use at least six characters.',
        },
        permissionLevel: {
          required: 'Need to assign a permission Level',
        },
      },
      submitHandler() { component.handleSubmit(event); },
    });
  }


  handleSubmit(event) {

    event.preventDefault()
    

    const { history } = this.props;

      Meteor.call('createUserFromAdmin',
        this.emailAddress.value,
        this.password.value,
        this.username.value,
        this.firstName.value,
        this.lastName.value,
        this.permissionLevel.value,
        function (error, result) {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('Created User!', 'success');
            document.getElementById("form").reset();
          }
        })
  }

  render() {
    return (

      <div>
      
        <form ref={form => (this.form = form)} onSubmit={event => this.handleSubmit(event)} id='form'>

          <FormGroup>
            <ControlLabel>First Name</ControlLabel>
            <input
              type="text"
              name="firstName"
              ref={firstName => (this.firstName = firstName)}
              className="form-control"
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Last Name</ControlLabel>
            <input
              type="text"
              name="lastName"
              ref={lastName => (this.lastName = lastName)}
              className="form-control"
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <input
              type="email"
              name="emailAddress"
              ref={emailAddress => (this.emailAddress = emailAddress)}
              className="form-control"
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>UserName</ControlLabel>
            <input
              type="text"
              name="username"
              ref={username => (this.username = username)}
              className="form-control"
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Password (min. 6 characters)</ControlLabel>
            <input
              type="password"
              name="password"
              ref={password => (this.password = password)}
              className="form-control"
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Permission Level</ControlLabel>
            <p><select
              ref={permissionLevel => (this.permissionLevel = permissionLevel)}
              name="permissionLevel">
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="user">Unprivileged User</option>
            </select></p>
          </FormGroup>
          <Button type="submit" bsStyle="success">Create User</Button>

          <p></p>
				
        </form>
      </div>
    );
  }
}




export default CreateUser;