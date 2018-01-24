import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base'

class CreateUser extends Component {
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
             
            },
            messages: {
             
            },
            submitHandler() { component.handleSubmit(); },
          });


      }
   
   
    handleSubmit() {
       
        const { history } = this.props;
        
        if (Meteor.isServer){
         console.log("server side");
         
        } else if (Meteor.isClient){

          Meteor.call('createUserFromAdmin',
            this.emailAddress.value,
            this.password.value,
            this.username.value,
            this.firstName.value,
            this.lastName.value,
            function(error,result){
              if(error){
                console.log("something goes wrong with the following error message " + error.reason )
                Bert.alert(error.reason, 'danger');
              } else {
                console.log('Successfully Created User')
                Bert.alert('Created User!', 'success');
                history.push('/successCreateUser')
              }
            }) 
          
        }
    }

    render() {
        return (
            
            <div className="container">
                <header>
                    <h1>Create User</h1>
                </header>
          
                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            
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
                <ControlLabel>Password</ControlLabel>
                <input
                  type="password"
                  name="password"
                  ref={password => (this.password = password)}
                  className="form-control"
                />
              </FormGroup>
              <Button type="submit" bsStyle="success">Create User</Button>

            </form>
            </div>
        );
    }
}




export default CreateUser;