import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar} from 'react-bootstrap';
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
import IntermediatesDatabaseData from './IntermediatesDatabaseData.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js';
import  Formulas  from '../../../api/Formulas/formulas'
import LotsTable from '../../table/LotsTable.js'
import TableData from '../../table/TableData.js'

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
          console.log(row)
          let editQuantity = row.original.pkg != '' ? 
          <div className="container-button2">
            <Button bsStyle="info"
            onClick={e=>{
              TableData.toggleEditable()
              this.forceUpdate()
            }}>
            Edit Lots
            </Button>
          <details>
          <summary>Lots</summary>
                    <LotsTable 
                        ingredient={row.original.fullIntermediate}
                    />
          </details>
          </div>
     
        : null

          return(
            <div>
            {editQuantity}
            <div className="container-button2">
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





