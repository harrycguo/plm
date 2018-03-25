import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { withTracker } from 'meteor/react-meteor-data';
import { Formulas } from '../../../api/Formulas/formulas.js'
import  ProductionReport   from '../../../api/ProductionReport/ProductionReport.js'
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'

class ProductionReportPage extends Component {
  constructor(props) {
    super(props)
  }

  headerValues() {

    return [
      {
        Header: 'Formula Name',
        accessor: 'formulaName',
      },
      {
        Header: 'Number Units Produced',
        accessor: 'numUnitsProduced',
      },
      {
        Header: 'Total Spending',
        accessor: 'totalSpending',
      },
    ];
  }

  renderRows(_this) {

    var reportRows = new Array()

    let formulaNameMap = new Map()
    let formulas = this.props.formulas
  
    for (let i = 0; i < formulas.length; i++){
      formulaNameMap.set(formulas[i]._id, formulas[i].name)
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
  return {
    formulas: Formulas.find({}).fetch(),
    prodReport: ProductionReport.find({}).fetch()
  };
})(ProductionReportPage)





