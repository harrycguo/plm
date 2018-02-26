import React, { Component } from 'react';
import { Link , BrowserRouter} from 'react-router-dom';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js';
import AddFormulaForm from '../../forms/AddFormulaForm.js'


class AddFormula extends Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    
    return (
      <div className="container">
        <header>
          <h1>Add New Formula</h1>
        </header>
        <FormulaManagementNavBar/>
        <AddFormulaForm hist = {this.props}/>
        <p></p>
				<p><Link to='/formulaManagement'>Return to Formula Management</Link></p>
          
      </div>
    );
  }
}

export default AddFormula;





