import React, { Component , PropTypes } from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { Accounts } from 'meteor/accounts-base';
import { StorageCapacities } from '../../../api/StorageCapacities/storageCapacities.js';
import { withTracker } from 'meteor/react-meteor-data';
import InventoryManagementNavBar from '../../components/InventoryManagementNavBar/InventoryManagementNavBar.js'


class EditCapacities extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount() {    
        const component = this; 
        
        validate(component.form, {
            rules: {
              freezerCapacity: {
                required: true,
                number: true,
              },
              refrigeratorCapacity: {
                required: true,
                number: true,
              },
              warehouseCapacity: {
                required: true,
                number: true,
              },
            },
            messages: {
              freezerCapacity: {
                required: 'Input New Capacity',
                number: 'Must be number',
              },
              refrigeratorCapacity: {
                required: 'Input New Capacity',
                number: 'Must be number',
              },
              warehouseCapacity: {
                required: 'Input New Capacity',
                number: 'Must be number',
              },
            },
            submitHandler() { component.handleSubmit(); },
          });
      }
   
    handleSubmit() {
       
        const { history } = this.props;
        let capacities = this.props.capacities

        let capacitiesMap = new Map()
        let capacitiesIDArray = []

        for(let i = 0; i < capacities.length; i++){
            capacitiesIDArray.push(capacities[i]._id)
            if (capacities[i].name == 'Freezer'){
                capacitiesMap.set(capacities[i]._id, Number(this.freezerCapacity.value))
            }
            if (capacities[i].name == 'Refrigerator'){
                capacitiesMap.set(capacities[i]._id, Number(this.refrigeratorCapacity.value))
            }
            if (capacities[i].name == 'Warehouse'){
                capacitiesMap.set(capacities[i]._id, Number(this.warehouseCapacity.value))
            }
        }

        for (let i = 0; i < capacitiesIDArray.length; i++){
            
            let id = capacitiesIDArray[i]
            Meteor.call('sc.editCapacity',
            id,
            capacitiesMap.get(id),
            function(error,result){
              if(error){
                Bert.alert(error.reason, 'danger');
              } 
            }) 
        }

        Bert.alert('Edited Capacities!', 'success');
        //history.push('/inventoryManagement')
        
    }

    render() {

        let capacities = this.props.capacities
        
        let capacitiesMap = new Map()

        for(let i = 0; i < capacities.length; i++){
            if (capacities[i].name == 'Freezer'){
                capacitiesMap.set('Freezer', Number(capacities[i].capacity))
            }
            if (capacities[i].name == 'Refrigerator'){
                capacitiesMap.set('Refrigerator', Number(capacities[i].capacity))
            }
            if (capacities[i].name == 'Warehouse'){
                capacitiesMap.set('Warehouse', Number(capacities[i].capacity))
            }
        }

        return (
            
            <div className="container">
                <header>
                    <h1>Edit Capacities</h1>
                </header>
           
                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>

                <FormGroup>
                    <ControlLabel>Freezer Capacity</ControlLabel>
                    <input
                        type="number"
                        step="1"
                        name="freezerCapacity"
                        ref={capacity => (this.freezerCapacity = capacity)}
                        defaultValue={capacitiesMap.get('Freezer')}
                        className="form-control"
                    />
                    Sq. Ft.
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Refrigerator Capacity</ControlLabel>
                    <input
                        type="number"
                        step="1"
                        name="refrigeratorCapacity"
                        ref={capacity => (this.refrigeratorCapacity = capacity)}
                        defaultValue={capacitiesMap.get('Refrigerator')}
                        className="form-control"
                    />
                    Sq. Ft.
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Warehouse Capacity</ControlLabel>
                    <input
                        type="number"
                        step="1"
                        name="warehouseCapacity"
                        ref={capacity => (this.warehouseCapacity = capacity)}
                        defaultValue={capacitiesMap.get('Warehouse')}
                        className="form-control"
                    />
                    Sq. Ft.
                </FormGroup>

              <Button type="submit" bsStyle="success">Submit</Button>

            </form>

            <p></p>
            <div className="container-keepLeft">
                    <Link to='/inventoryManagement'>Return to Inventory Management</Link>
                </div>
            <div className="container-keepLeft">
                    <Link to='/formulaManagement'>Return to Formula Management</Link>
                </div>
            </div>
            
        );
 
    }

}

export default withTracker(() => {
    const subscription = Meteor.subscribe('storageCapacities');
      return {
        capacities: StorageCapacities.find({}).fetch(),
      };
    })(EditCapacities);