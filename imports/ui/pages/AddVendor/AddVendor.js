import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base'

class AddVendor extends Component {
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
              name: {
                required: true,
              },
              contact: {
                required: true,
              },
              FCC: {
                required: true,
              },
            },
            messages: {
              name: {
                required: 'Input Vendor Name',
              },
              contact: {
                required: 'Input Contact Info',
              },
              FCC: {
                required: 'Input Freight Carrier Code',
              },
              
            },
            submitHandler() { component.handleSubmit(); },
          });


      }
   
   
    handleSubmit() {
       
        const { history } = this.props;
        
        if (Meteor.isServer){
         console.log("server side");
         
        } else if (Meteor.isClient){

          Meteor.call('vendors.insert',
            this.name.value,
            this.contact.value,
            this.FCC.value,
            function(error,result){
              if(error){
                console.log("something goes wrong with the following error message " + error.reason )
                Bert.alert(error.reason, 'danger');
              } else {
                console.log('Successfully Added Vendor')
                Bert.alert('Added Vendor!', 'success');
                history.push('/vendorManagement')
              }
            }) 
          
        }
    }

    render() {
        return (
            
            <div className="container">
                <header>
                    <h1>Add Vendor</h1>
                </header>
          
                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            
                <FormGroup>
                    <ControlLabel>Vendor Name</ControlLabel>
                    <input
                        type="text"
                        name="name"
                        ref={name => (this.name = name)}
                        className="form-control"
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Contact Info</ControlLabel>
                    <input
                        type="phoneUS"
                        name="contact"
                        ref={contact => (this.contact = contact)}
                        className="form-control"
                    />
                </FormGroup>

                <FormGroup>
                <ControlLabel>Freight Carrier Code</ControlLabel>
                <input
                  type="text"
                  name="FCC"
                  ref={FCC => (this.FCC = FCC)}
                  className="form-control"
                />
              </FormGroup>

  
              <Button type="submit" bsStyle="success">Add Vendor</Button>

            </form>
            </div>
        );
    }
}




export default AddVendor;