import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { ProductionLines } from '../../../api/ProductionLines/productionLines.js'
import ProductionLineItem from './ProductionLineItem.js'


class ProductionLineManagement extends Component {
  constructor(props) {
    super(props);
}

renderProductionLines() {
  return this.props.productionLines.map((productionLine) => (
    <ProductionLineItem key={productionLine._id} productionLine={productionLine} />
  ));
}

  render() {

      return (
        <div>
          <h2>List of Production Lines</h2>
          <hr className="divider"></hr>
  
          <ul>
            {this.renderProductionLines()}
          </ul>
        </div>
      )
  }
}

export default withTracker(() => {
  Meteor.subscribe('productionLines');
    return {
      productionLines: ProductionLines.find({}).fetch(),
    };
  })(ProductionLineManagement);





