import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'

class FormulaManagementHome extends Component {
  constructor(props) {
    super(props);  
}

  render() {
    return (
      <div className="container">
        <header>
            <h1>Formula Management</h1>
        </header>
        
        <FormulaManagementNavBar hist = {this.props}/>

      </div>
    );
  }
}

export default FormulaManagementHome;





