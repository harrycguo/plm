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
          console.log("I'm doing stuff")
          Meteor.call('createUserFromAdmin',
          
          function(err,result){
            if(!err){
               console.log("a new user just got created")
               history.push('/successCreateUser');
              }else{
                console.log("something goes wrong with the following error message " +err.reason )
              }
           })
          
        }

        // Accounts.createUser({
        //   email: this.emailAddress.value,
        //   password: this.password.value,
        //   username: this.username.value,
        //   profile: {
        //     name: {
        //       first: this.firstName.value,
        //       last: this.lastName.value,
        //       username: this.username.value,
        //     },
        //   },
        // }, (error) => {
        //   if (error) {
        //     Bert.alert(error.reason, 'danger');
        //   } else {
        //     Bert.alert('Welcome!', 'success');
        //     history.push('/successCreateUser');
        //     // const user = Meteor.user()
        //     // Roles.addUsersToRoles(user, ['user']);
        //   }
        // }); 

        
        
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