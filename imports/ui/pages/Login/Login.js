import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Carts from '../../../api/Cart/Cart.js';

if (Meteor.isClient) {
  Meteor.subscribe('carts');
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log("User = ")
    console.log(Meteor.user());
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        username: {
          required: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        username: {
          required: 'Must have username.',
        },
        password: {
          required: 'Must have password.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    Meteor.loginWithPassword({username: this.username.value} , this.password.value, 
      (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {

            Bert.alert('Welcome!', 'success');
            //determine route based on role
            let user = Meteor.user();

            //Creates a cart for user if they don't already have one
            if (Carts.find({ user : Meteor.userId()}).fetch().length === 0) { 
              Meteor.call('createUserCart');
            }

            //admin login
            if (Roles.userIsInRole(user, ['admin'])) {
              history.push('/adminHomepage');
            } 
            //user login
            else {
              history.push('/userHomepage');
            }
          }
      });
  }

  render() {
    return (
    <div className="container">
      <header>
      <h1>Login Page!</h1>
    </header>
    

    <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        
        <FormGroup>
                <ControlLabel>Username</ControlLabel>
                <input
                  type="text"
                  name="username"
                  ref={username => (this.username = username)}
                  className="form-control"
                />
        </FormGroup>
        <FormGroup>
            <ControlLabel>Password</ControlLabel>
                <input
                  type="password"
                  name="password"
                  ref={password => (this.password = password)}
                  className="form-control"
                />
              </FormGroup>
        <div className="form-group">
            <Button type="submit" bsStyle="success">Log In</Button>
        </div>
      </form>
      </div>
      );
  }
}

export default Login;


