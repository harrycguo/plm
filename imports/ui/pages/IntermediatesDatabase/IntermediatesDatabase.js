import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
import IntermediatesDatabaseData from './IntermediatesDatabaseData.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js';
import  Formulas  from '../../../api/Formulas/formulas'
import LotsTable from '../../table/LotsTable.js'
import TableData from '../../table/TableData.js'
import Lots from '../../../api/Lots/Lots'


class IntermediatesDatabase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioState: true
    };
}

  renderIntermediatesTable() {

    let data = new Array();
    let intermediates = this.props.intermediates

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

      return (
        <ReactTable
        data={data} 
        columns={IntermediatesDatabaseData.IntermediateHeaderValues}
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
            
            </div> 
          )}}
        />
      )
  }

  renderFinalProductsTable() {

    let data = new Array()
    let formulas = this.props.formulas
    
    let lotsMap = new Map()
    let lots = this.props.lots

    for (let i = 0; i < lots.length; i++) {
        lotsMap.set(lots[i].inventoryID, lots[i].queue)
    }

    for (let i = 0; i < formulas.length; i++) {
      let formula = formulas[i]
      data.push({
        name: formula.name,
        qty: formula.quantity,
        fullFinalProduct: formula,
        lotsData: lotsMap.get(formula._id)
      })
    }

    return (

      <ReactTable
              data={data}
              filterable
              columns={IntermediatesDatabaseData.FinalProductsHeaderValues}
              noDataText="Loading..."
              SubComponent={row => {
                return (
                  <div>
                    {this.renderSubComponent(row.original.lotsData)}
                    </div>
                )
              }}
              
            />
    )
  }

  renderSubComponent(lotsData){
 
    let tableData = []

    for (let i = 0; i < lotsData.length; i++){
      tableData.push(
        <tr key={i}>
          <td>{lotsData[i].lot}</td>
          <td>{lotsData[i].qty}</td> 
          <td>{new Date(lotsData[i].time).toString()}</td>
        </tr>
      )
    }

    return(
      <table>
		    		<tbody>
		    			<tr>
		    				<th>Lot Number</th>
                <th>Quantity</th>
		    				<th>Time Lot Created</th>
						</tr>
            {tableData}
	    			</tbody>
	    </table>
    )
  
  }

  onChangeRadio(){
 
    this.setState((prevState) => ({
        radioState: !prevState.radioState
    }))
  }

  render() {
    return (
      <div>
        <p></p>
        <ButtonToolbar>
            <ToggleButtonGroup type="radio" name="options" ref={radio => (this.radio) = radio} defaultValue={1} onChange={this.onChangeRadio.bind(this)}>
                <ToggleButton value={1}>Final Products</ToggleButton>
                <ToggleButton value={2}>Intermediates</ToggleButton>
            </ToggleButtonGroup>
        </ButtonToolbar>
        <p></p>
        <StorageCapacityWrapper hist = {this.props.hist}/>
        {this.state.radioState ? this.renderFinalProductsTable() : this.renderIntermediatesTable()}
      </div>
    );
  }
}

export default withTracker(() => {
    const subscription = Meteor.subscribe('intermediates')
    Meteor.subscribe('formulas')
    Meteor.subscribe('lots')
    return {
        loading: subscription.ready(),
        intermediates: Intermediates.find({}).fetch(),
        formulas: Formulas.find({}).fetch(),
        lots: Lots.find({}).fetch()
    };
})(IntermediatesDatabase);





