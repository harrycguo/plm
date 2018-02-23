import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'

class FormulaManagement extends Component {
  constructor(props) {
    super(props);
    
}

  render() {
    return (
      <div className="container">
        <header>
          <h1>Formula Management</h1>
        </header>
        <FormulaManagementNavBar/>
        <p></p>

        <h2>List of Formulas</h2>
        <hr></hr>

      </div>
    );
  }
}

export default FormulaManagement;





