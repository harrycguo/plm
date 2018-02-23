import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'
import { Formulas } from '../../../api/Formulas/formulas.js'
import FormulaListItem from '../../components/Formula/FormulaListItem.js'

class FormulaManagement extends Component {
  constructor(props) {
    super(props);   
}

renderFormulas() {
  return this.props.formulas.map((formula) => (
    <FormulaListItem key={formula._id} formula={formula} />
  ));
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

        <ul>
          {this.renderFormulas()}
        </ul>

      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('formulas');
    return {
      formulas: Formulas.find({}).fetch(),
    };
  })(FormulaManagement);





