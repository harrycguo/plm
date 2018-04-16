import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { Intermediates } from '../../../api/Intermediates/intermediates' 
import Formulas from '../../../api/Formulas/formulas.js'

class ViewProductionLine extends Component {
  constructor(props) {
    super(props);
}

renderTableData(){
  let items = []
  let formulasMap = new Map()
  let intermediatesMap = new Map()

  for (let i = 0; i < this.props.formulas.length; i++){
    formulasMap.set(this.props.formulas[i]._id, this.props.formulas[i].name)
  }

  for (let i = 0; i < this.props.intermediates.length; i++){
    intermediatesMap.set(this.props.intermediates[i]._id, this.props.intermediates[i].name)
  }

  let formulas = this.props.location.state.productionLine.formulasList

  for (let i = 0; i < formulas.length; i++){
    let item1 = formulasMap.get(formulas[i].id)
    let item2 = intermediatesMap.get(formulas[i].id)

    item1 != undefined ? items.push(<div key={i}>{item1}</div>) : items.push(<div key={i}>{item2}</div>)
  }

  return items
}

  render() {

      return (
        <div className="container">
          <header>
            <h1>View Production Line</h1>
          </header>
          <h2>{this.props.location.state.productionLine.name}</h2>
          <hr className="divider"></hr>
          <p></p>
          <p> <b>Production Line Name:</b> {this.props.location.state.productionLine.name}</p>
          <p> <b>Description:</b> {this.props.location.state.productionLine.description}</p>
          <p></p>

          <b>Producible Formulas:</b>
          {this.renderTableData()}

          <p></p>
          <hr className='divider'></hr>
          <p></p>
          <p><Link to='/productionLineManagement'>Return to Production Line Management</Link></p>
        </div>
      )
  }
}

export default withTracker(() => {
    Meteor.subscribe('formulas');
    Meteor.subscribe('intermediates')
    return {
        formulas: Formulas.find({}).fetch(),
        intermediates: Intermediates.find({}).fetch()
    };
})(ViewProductionLine);





