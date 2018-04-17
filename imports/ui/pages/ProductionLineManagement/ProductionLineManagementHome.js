import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import ProductionLineNavBar from '../../components/ProductionLineNavBar/ProductionLineNavBar.js'


class ProductionLineManagementHome extends Component {
  constructor(props) {
    super(props);
}

  render() {

      return (
        <div className="container">
          <header>
            <h1>Production Line Management</h1>
          </header>
          <ProductionLineNavBar hist={this.props}/>
         
        </div>
      )
  }
}

export default ProductionLineManagementHome





