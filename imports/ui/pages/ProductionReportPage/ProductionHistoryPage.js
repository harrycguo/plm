import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import Datetime from 'react-datetime'
import ReactTable from 'react-table';
import { ProductionHistory } from '../../../api/Production/production.js'
import IngredientsList from '../../../api/Ingredients/IngredientList.js';
import { Intermediates } from '../../../api/Intermediates/intermediates' 

class ProductionHistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        filterlow: -1,
        filterhigh: -1,
    }
}

  headerValues() {

    return [
    {
      Header: "Expand",
      columns: [
        {
        expander: row => { return false },
        Header: () => <strong>More</strong>,
        width: 65,
        Expander: ({ isExpanded, ...rest }) =>
          <div>
            {isExpanded
              ? <span>&#x2299;</span>
              : <span>&#x2295;</span>}
          </div>,
        style: {
          cursor: "pointer",
          fontSize: 25,
          padding: "0",
          textAlign: "center",
          userSelect: "none"
        },
        Footer: () => <span>&hearts;</span>
      }
    ]
  },
      {
        Header: 'Formula Name',
        accessor: 'formulaName',
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by name"
	      />
      },
      {
        Header: 'Lot Number',
        accessor: 'lotNumber',
		Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by lot number"
	      />
      },
      {
        Header: 'Number Units Produced',
        accessor: 'numUnitsProduced',
        Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by # Units Produced"
	      />
      },
      {
        Header: 'Time Of Production',
        accessor: 'time',
        filterMethod: (filter, row) => {
            console.log(filter)
            console.log(row._original.truetime)
            if(this.state.filterlow<0 && this.state.filterhigh<0) {
                return true;
            }
            else if(this.state.filterhigh<0 && this.state.filterlow>=0){
                return (Number(this.state.filterlow) < row._original.truetime)
            }
            else{
                return (Number(this.state.filterlow) < row._original.truetime && 
                    row._original.truetime < Number(this.state.filterhigh) );
            }
        },
        Filter: ({ filter, onChange }) => (
          <div>
              <Datetime 
              defaultValue = {new Date(0)}
              onChange = {event => {
                  var x = new Date(event._i)
                  this.state.filterlow = isNaN(Date.parse(x)) ? this.state.filterlow : Date.parse(x);
                onChange(Date.parse(this.state.filterlow))
              }}
              />
              <Datetime 
              defaultValue = {new Date(Date.now())}
              onChange = {event => {
                  var x = new Date(event._i)
                  this.state.filterhigh = isNaN(Date.parse(x)) ? this.state.filterhigh : Date.parse(x);
                  onChange(Date.parse(this.state.filterhigh))
              }}
              />
        </div>
        )
    },
    ];
  }

  renderRows(){
      let hist = this.props.productionHistory
      let data = new Array()
      for (let i = 0; i < hist.length; i++){
        data.push({
          formulaName: hist[i].name,
          lotNumber: hist[i].lotNumber,
          numUnitsProduced: hist[i].unitsProduced,
          time: new Date(hist[i].time).toString(),
          lotsData: hist[i].lotsData
        })
      }
      return data
  }

  renderSubComponent(lotsData){
    
    //create ing map to get names
    let ingMap = new Map();
    let intMap = new Map();
    for (let i = 0; i < this.props.ingredients.length; i++) {
      ingMap.set(this.props.ingredients[i]._id, this.props.ingredients[i].name)
    }
    for (let i = 0; i < this.props.intermediates.length; i++) {
      intMap.set(this.props.intermediates[i]._id, this.props.intermediates[i].name)
    }
    
    let tableData = []
    let k = 0
    for (let i = 0; i < lotsData.length; i++){
      let name1 = ingMap.get(lotsData[i].ingredient)
      let name2 = intMap.get(lotsData[i].ingredient)

      let name = name1 != undefined ? name1 : name2

      let lots = lotsData[i].lots
      console.log(lots)
      for (let j = 0; j < lots.length; j++){
        tableData.push(
          <tr key={k}>
            <td>{name}</td>
            <td>{lots[j].lotNumber}</td> 
            <td>{new Date(lots[j].time).toString()}</td>
          </tr>
        )
        k++
      }
      k++
    }
    
    return(
      <table>
		    		<tbody>
		    			<tr>
		    				<th>Ingredient Used</th>
		    				<th>Lot Number</th>
		    				<th>Time Lot Purchased</th>
						</tr>
            {tableData}
	    			</tbody>
	    </table>
    )

  }

  render() {
    return (
        <div>
          <ReactTable
            data={this.renderRows(this)}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
            }
            SubComponent={row => {
              return (
                <div>
                  {this.renderSubComponent(row.original.lotsData)}
                  </div>
              )
            }}
            columns={this.headerValues()}
          />
        </div>
      );
    }
}

export default withTracker(() => {
    Meteor.subscribe('productionHistory')
    Meteor.subscribe('ingredients')
    Meteor.subscribe('intermediates')
    return {
      productionHistory: ProductionHistory.find({}).fetch(),
      ingredients: IngredientsList.find({}).fetch(),
      intermediates: Intermediates.find({}).fetch()
    };
  })(ProductionHistoryPage)





