import React, { Component , PropTypes } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js';
import { withTracker } from 'meteor/react-meteor-data';

class EditCapacity extends Component {
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
              capacity: {
                required: true,
                number: true,
              },
            },
            messages: {
              capacity: {
                required: 'Input New Capacity',
                number: 'Must be number',
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

          Meteor.call('sc.editCapacity',
            this.props.match.params.capacityID,

            Number(this.capacity.value),
            function(error,result){
              if(error){
                console.log("something goes wrong with the following error message " + error.reason )
                Bert.alert(error.reason, 'danger');
              } else {
                Bert.alert('Edited Capacity!', 'success');
                history.push('/adminHomepage')
              }
            }) 
        
        }
    }

    render() {
       
        return (
            
            <div className="container">
                <header>
                    <h1>Edit Capacity</h1>
                </header>

                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            
                <h2> Editing {this.props.location.state.type} </h2>

                <FormGroup>
                    <ControlLabel>Capacity</ControlLabel>
                    <input
                        type="number"
                        name="capacity"
                        ref={capacity => (this.capacity = capacity)}
                        defaultValue={this.props.location.state.capacity}
                        className="form-control"
                    />
                    lbs
                </FormGroup>

              <Button type="submit" bsStyle="success">Submit</Button>

            </form>
            </div>
        );
 
    }

}

export default withTracker(() => {
    const subscription = Meteor.subscribe('capacities');
      return {
        capacities: StorageCapacities.find({}).fetch(),
      };
    })(EditCapacity);