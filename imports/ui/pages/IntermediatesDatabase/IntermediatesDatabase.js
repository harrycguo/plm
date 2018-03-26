import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar} from 'react-bootstrap';
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
import IntermediatesDatabaseData from './IntermediatesDatabaseData.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js';
import  Formulas  from '../../../api/Formulas/formulas'

class IntermediatesDatabase extends Component {
  constructor(props) {
    super(props);
    
}

  renderTable() {

    let data = new Array();
    let intermediates = this.props.intermediates
    let formulas = this.props.formulas

    for (let i = 0; i < intermediates.length; i++) {
      let intermediate = intermediates[i]

      var floorSpace = null
	    switch(intermediate.packageInfo.packageType) {
        case "sack":
        	floorSpace = 0.5;
        	break;
        case "pail":
        	floorSpace = 1.5;
        	break;
        case "drum":
        	floorSpace = 3;
        	break;
        case "supersack":
        	floorSpace = 16;
        	break;
        case "truckload":
        case "railcar":
        	floorSpace = 0;
        	break;
	  }
	  var numPackagesWithFloorspace = floorSpace*intermediate.packageInfo.numPackages;
	  numPackagesWithFloorspace = numPackagesWithFloorspace.toString().concat(" Sq. Ft. (").concat(intermediate.packageInfo.numPackages.toString()).concat(" pkg(s))")
    
    var packageString = intermediate.packageInfo.packageType.charAt(0).toUpperCase().concat(intermediate.packageInfo.packageType.substr(1))
    var tempString = intermediate.temperatureState.charAt(0).toUpperCase().concat(intermediate.temperatureState.substr(1))
    
      data.push({
        name: intermediate.name,
        temp: tempString,
        pkg: packageString,
        numpkg: numPackagesWithFloorspace,
        numNativeUnitsPerPackage: intermediate.nativeInfo.numNativeUnitsPerPackage,
        qty: intermediate.nativeInfo.totalQuantity,
        unit: intermediate.nativeInfo.nativeUnit,
        fullIntermediate: intermediate
      })

    }

    for (let i = 0; i < formulas.length; i++) {
      let formula = formulas[i]
      data.push({
        name: formula.name,
        temp: '',
        pkg: '',
        numpkg: '',
        numNativeUnitsPerPackage: '',
        qty: formula.quantity,
        unit: '',
        fullIntermediate: formula
      })
    }

      return (
        <ReactTable
        data={data} 
        columns={IntermediatesDatabaseData.HeaderValues}
        filterable
        noDataText="Loading..."
        SubComponent={row => {

          let editQuantity = row.original.pkg != '' ? 
          <div className="container-button2">
          <Link to={{
            pathname: '/editIntermediateQuantity/'+row.original.fullIntermediate._id, 
            state: {
              name: row.original.name,
              intermediate: row.original.fullIntermediate
            }
          
          }}>
            <Button bsStyle="info">
            View Lots / Edit Quantity
            </Button>
          </Link>
          </div>
     
        : null

          return(
            <div className="side-container-zero">
            {editQuantity}
            <div className="container-button2">
            <Link to={{
            pathname: '/editIntermediateQuantity/', 
            }
          
            // state: {
            //   name: this.props.sc.name,
            //   capacity: this.props.sc.capacity,
            //   }
            // }
            }>
              <Button bsStyle="primary">
              View Production History
              </Button>
            </Link>
            </div>
            
            </div> 
          )}}
        />
      )
  }

  render() {
    return (
      <div>
        <StorageCapacityWrapper hist = {this.props.hist}/>
        {this.renderTable()}
      </div>
    );
  }
}

export default withTracker(() => {
    const subscription = Meteor.subscribe('intermediates')
    Meteor.subscribe('formulas')
    return {
        loading: subscription.ready(),
        intermediates: Intermediates.find({}).fetch(),
        formulas: Formulas.find({}).fetch()
    };
})(IntermediatesDatabase);





