import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import StorageCapacityWrapper from '../../components/StorageCapacityWrapper/StorageCapacityWrapper.js'
import DNIData from './DNIData.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js';
import  Formulas  from '../../../api/Formulas/formulas'
import Lots from '../../../api/Lots/Lots'
import IntermediatesDatabase from '../../pages/IntermediatesDatabase/IntermediatesDatabase.js'


class DNIView extends Component {
  constructor(props) {
    super(props);
    var map = new Map();
    this.state = {
      table: null,
      map: map,
    };
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
      this.state.map.set(formula.name, {
        price: -1,
        qty: -1,
        id: formula._id,
      })
      data.push({
        name: formula.name,
        qty: formula.quantity,
        tosell:(<input 
          type="text"
          defaultValue={this.state.map.get(formula.name).qty<0 ? '' : this.state.map.get(formula.name).qty}
          onChange = {e=> {
            var oldStruct = this.state.map.get(formula.name)
            var newStruct = {
              price: oldStruct.price,
              qty: e.target.value,
              id: oldStruct.id
            }
            this.state.map.set(formula.name, newStruct)
          }}
        />),
        price: (<input 
          type="text"
          onChange = {e=> {
            var oldStruct = this.state.map.get(formula.name)
            var newStruct = {
              price: e.target.value,
              qty: oldStruct.qty,
              id: oldStruct.id
            }

            this.state.map.set(formula.name, newStruct)
          }}
        />),
        fullFinalProduct: formula,
        lotsData: lotsMap.get(formula._id)
      })
    }
    var table = (

      <ReactTable
              data={data}
              columns={DNIData.FinalProductsHeaderValues}
              noDataText="Loading..."
              sortable={false}
              SubComponent={row => {
                return (
                  <div>
                    {this.renderSubComponent(row.original.lotsData)}
                    </div>
                )
              }}
              
            />
    );
    this.state.table = table
    return table;
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

  render() {
    if (!this.userId || (!Roles.userIsInRole(this.userId, 'admin') && !Roles.userIsInRole(this.userId, 'manager'))) {
      return (
        <div>
        <p></p> 
        <Button 
          bsStyle="success"
          onClick={e=>{
            var shouldConfirm = false
            var prompt = "Confirm sale: \nName | Quantity | Price\n"
            this.state.map.forEach(function(item, name) {
              var price = Number(item.price)
              var qty = Number(item.qty)
              if(!isNaN(price) && !isNaN(qty) && price >= 0 && qty > 0) {
                  shouldConfirm=true
                  prompt = prompt.concat(name).concat(" | ").concat(item.qty).concat(" | $").concat(item.price).concat("\n")
              }
            })
            if(shouldConfirm && confirm(prompt)) {
              console.log("Use up the stuff")
              this.state.map.forEach(function(item, name) {
                console.log(name)
                console.log(item.id)
                console.log(item.price)
                console.log(item.qty)
                var price = Number(item.price)
                var qty = Number(item.qty)
                if(!isNaN(price) && !isNaN(qty) && price >= 0 && qty > 0) {
                  Meteor.call('lots.removeQtyFinalProduct', item.id, qty, price, 
                    function(error, result){
                         if (error) {
                            Bert.alert(error.reason, 'danger')
                        } 
                    }
                  )
                }
                })

              // 'profreport.updateAvgWholesalePrice': function(id, price, quantity) {
              //  -- Formula id 
              this.forceUpdate()

            }
          }}>
          Sell Items
        </Button>
        <p></p>
        {this.renderFinalProductsTable()}
        <p></p>
        </div>
      );
    } else {
      return (<IntermediatesDatabase />)
    }
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
})(DNIView);





