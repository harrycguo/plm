import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base'
import VendorManagementNavBar from '../../components/VendorManagementNavBar/VendorManagementNavBar.js'

class AddVendor extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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
         
        } else if (Meteor.isClient){

          Meteor.call('vendors.insert',
            this.name.value,
            this.contact.value,
            this.FCC.value,
            function(error,result){
              if(error){
                Bert.alert(error.reason, 'danger');
              } else {
                Bert.alert('Added Vendor!', 'success');
                document.getElementById("form").reset();
               
              }
            }) 
          
        }
    }

    render() {
        return (
            
            <div>
                
          
                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>
            
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
                    <textarea
                        type="text"
                        rows="3"
                        name="contact"
                        ref={contact => (this.contact = contact)}
                        className="form-control"
                        placeholder="Contact Info"
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