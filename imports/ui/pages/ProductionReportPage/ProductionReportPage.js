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

    console.log(this.props.prodReport)

    var reportRows = new Array()
    this.props.formulas.forEach(function (formula) {
      reportRows.push({
        formulaName: formula.name,
        numUnitsProduced: formula.totalProduced,
        totalSpending: formula.totalSpent,
      })
    });
    return reportRows;
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Production Report</h1>
        </header>
        <FormulaManagementNavBar />
        <p></p>
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





