import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { ProductionLines } from '../../../api/ProductionLines/productionLines.js'
import  Formulas  from '../../../api/Formulas/formulas.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import { Button, Label, Modal, ModalHeader, ModalBody, ModalTitle, OverlayTrigger, Popover, Tooltip, Row, Col, FormGroup, ControlLabel, ButtonGroup, ButtonToolbar } from 'react-bootstrap';



class LineStatuses extends Component {
  constructor(props) {
    super(props);

}

renderHeaders() {
  return (
      <div>
          <div className="side-container-zero">
              <div className="side-spacingInput">
                  <b>Production Line</b>
              </div>
              <div className="side-spacingInput">
                  <b>Status</b>
              </div>

              <div className="side-spacingInput">
                  <b>Formula In Production</b>
              </div>

          </div>
      </div>
  )
}

renderLinesInfo(){

  let formulaMap = new Map()
  for (let i = 0; i < this.props.formulas.length; i++){
    formulaMap.set(this.props.formulas[i]._id, this.props.formulas[i].name)
  }
  for (let i = 0; i < this.props.intermediates.length; i++){
    formulaMap.set(this.props.intermediates[i]._id, this.props.intermediates[i].name)
  }


  let lines = this.props.productionLines
  let linesArr = []

  for (let i = 0; i < lines.length; i++){
    linesArr.push(
      <div key={i}>
          <div className="side-container-zero">
              <div className="side-spacingInput">
                  {lines[i].name}
              </div>
              <div className="side-spacingInput">
                {lines[i].busy ? <Label bsStyle="warning">Busy</Label> : <Label bsStyle="success">Free</Label>}
              </div>

              <div className="side-spacingInput">
                {lines[i].busy ? formulasMap.get(lines[i].currentFormula) : '(none)'}
              </div>
          </div>
      </div>
    )
  }
  return linesArr
}

  render() {

      return (
        <div>
          <p></p>
          {this.renderHeaders()}
          {this.renderLinesInfo()}

        </div>
      )
  }
}

export default withTracker(() => {
  Meteor.subscribe('productionLines')
  Meteor.subscribe('formulas')
  Meteor.subscribe('intermediates')
    return {
      productionLines: ProductionLines.find({}).fetch(),
      formulas: Formulas.find({}).fetch(),
      intermediates: Intermediates.find({}).fetch(),
    };
  })(LineStatuses);





