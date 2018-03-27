import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { withTracker } from 'meteor/react-meteor-data';
import Formulas  from '../../../api/Formulas/formulas.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import  ProductionReport   from '../../../api/ProductionReport/ProductionReport.js'

class ProductionReportPage extends Component {
  constructor(props) {
    super(props)
  }

  headerValues() {

    return [
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
        Header: 'Total Spending',
        accessor: 'totalSpending',
        Filter: ({ filter, onChange }) =>
	      <input
	        type="text"
	        onChange={event => onChange(event.target.value)}
	        style={{ width: '100%', height: '100%'}}
	        value={filter ? filter.value : ''}
	        placeholder="Filter by Total Spending"
	      />
      },
    ];
  }

  renderRows(_this) {

    var reportRows = new Array()

    let formulaNameMap = new Map()
    let formulas = this.props.formulas
    let intermediates = this.props.intermediates
  
    for (let i = 0; i < formulas.length; i++){
      formulaNameMap.set(formulas[i]._id, formulas[i].name)
    }

    for (let i = 0; i < intermediates.length; i++){
      formulaNameMap.set(intermediates[i]._id, intermediates[i].name)
    }

    this.props.prodReport.forEach(function (formula) {
      
      reportRows.push({
        formulaName: formulaNameMap.get(formula.formula),
        numUnitsProduced: formula.totalProduced,
        totalSpending: Number(formula.totalSpent).toFixed(2),
      })
    });
    return reportRows;
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
          columns={this.headerValues()}
        />


      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('formulas')
  Meteor.subscribe('prodReport')
  Meteor.subscribe('intermediates')
  return {
    formulas: Formulas.find({}).fetch(),
    prodReport: ProductionReport.find({}).fetch(),
    intermediates: Intermediates.find({}).fetch()
  };
})(ProductionReportPage)





