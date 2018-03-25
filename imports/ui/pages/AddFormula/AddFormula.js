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
      <div>
        <AddFormulaForm hist = {this.props}/>          
      </div>
    );
  }
}

export default AddFormula;





