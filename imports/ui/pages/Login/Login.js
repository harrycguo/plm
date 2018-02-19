import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import queryString from 'query-string';
import axios from 'axios';
import LoginData, { netIDusers } from './LoginData.js';
import { Roles } from 'meteor/alanning:roles';
import { NetIDusers } from '../../../api/Users/netIDusers.js'
import { withTracker } from 'meteor/react-meteor-data';

if (Meteor.isClient) {
  Meteor.subscribe('carts');
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    let windowHash = queryString.parse(window.location.hash)

    if (Object.keys(windowHash).length != 0) {
      this.netIDLogin(windowHash.access_token)
    }
  }

  //login with netID
  netIDLogin(token) {

    const { history } = this.props;

    axios.get('https://api.colab.duke.edu/identity/v1/', {
      headers: {
        'x-api-key': 'api-docs',
        'Authorization': `Bearer ${token}`
      }
    }).then(function (response) {

      let data = response.data

      Meteor.call('createUserDefault',
        data.mail,
        data.netid,
        data.netid,
        data.firstName,
        data.lastName,
        function (error, result) {
          if (error) {
            console.log(error.reason)
          } else {
            console.log('first time')
            Meteor.call('netIDusers.insert',
              data.netid,
            function (error, result) {
              if (error){
                console.log('Net ID add fail')
              } else {
                console.log('Net ID add SUCCESS')
              }
            })
          }
        })

      Meteor.loginWithPassword({ username: data.netid }, data.netid,
        (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {

            Bert.alert('Welcome NetID User!', 'success');
            //determine route based on role
            let user = Meteor.user();

            //Creates a cart for user if they don't already have one
            if (Carts.find({ user: Meteor.userId() }).fetch().length === 0) {
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
    })

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

  netID(username){
    for (let i = 0; i < this.props.netIDusers.length; i++) {
			if (this.props.netIDusers[i].user == username) {
        return true;
			}
    }
    return false;
  }

  handleSubmit() {
    const { history } = this.props;

    if (!this.netID(this.username.value)){

      Meteor.loginWithPassword({ username: this.username.value }, this.password.value,
        (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {

            Bert.alert('Welcome!', 'success');
            //determine route based on role
            let user = Meteor.user();

            //Creates a cart for user if they don't already have one
            if (Carts.find({ user: Meteor.userId() }).fetch().length === 0) {
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
      } else {
        Bert.alert('Username is a NetID, Please Sign in with Duke NetID', 'danger');
      }
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Login Page</h1>
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
            <Button type="submit" bsStyle="success">Login</Button>
            <p></p>
            <a href="https://oauth.oit.duke.edu/oauth/authorize.php?client_id=production-lifecycle-management&client_secret=FatQCXrMNx5EyBq!ms=i=%FJSSjMMFafJClHKTv*4WqC%dvmBt&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin&response_type=token&state=1327&scope=basic">
              <Button>
                Login With Duke NetID
          </Button>
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default withTracker(() => {
	Meteor.subscribe('netIDusers');
	return {
		netIDusers: NetIDusers.find({}).fetch(),
	};
})(Login);


