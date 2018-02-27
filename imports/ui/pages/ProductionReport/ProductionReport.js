import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { withTracker } from 'meteor/react-meteor-data';
import { Formulas } from '../../../api/Formulas/formulas.js'
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'

class ProductionReport extends Component {
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
		this.props.formulas.forEach(function(formula) {
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
        <FormulaManagementNavBar/>
        <p></p>
       		<ReactTable
	    		data={this.renderRows(this)}
	    		filterable
	    		defaultFilterMethod={ (filter, row) => 
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
    return {
      formulas: Formulas.find({}).fetch(),
    };
  })(ProductionReport)





