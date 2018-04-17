import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { ProductionLines } from '../../../api/ProductionLines/productionLines.js'
import  Formulas  from '../../../api/Formulas/formulas.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import { Button, Label, Modal, ModalHeader, ModalBody, ModalTitle, OverlayTrigger, Popover, Tooltip, Row, Col, FormGroup, ControlLabel, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import Timer from '../Cart/Timer.js'

class LineStatuses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: null
    }

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


    let user = Meteor.user()
    let changeStatus = null
    if (Roles.userIsInRole(user, ['admin', 'manager'])) {
      changeStatus = <td align="center">
      {lines[i].busy ? 
        
        <select
              ref={input => (this[`input${i}`] = input)}
              name="status"
              style={{ width: '100%', height: '100%' }}

          >
              <option value='inProgress'> In Progress </option>
              <option value='complete'> Complete </option>
          </select>
        : 'N/A'}
    </td>
    }

    linesArr.push(
      <tr key={i}>
         
              <td>
                  {lines[i].name}
              </td>
              <td align="center">
                {lines[i].busy ? <Label bsStyle="warning">Busy</Label> : <Label bsStyle="success">Free</Label>}
              </td>

              <td>
                {lines[i].busy ? formulaMap.get(lines[i].currentFormula) : '(none)'}
              </td>

              <td>
                {lines[i].busy ? lines[i].quantity : 'N/A'}
              </td>

              {changeStatus}

              

          </tr>
 
    )
  }
  return linesArr
}

updateStatus() {

  let lines = this.props.productionLines
  let linesArr = new Array()

  for (let i = 0; i < lines.length; i++){
    let value = this[`input${i}`] != undefined ? this[`input${i}`].value : 'none'
    linesArr.push({
      line: lines[i]._id,
      status: value
    })
  }

  Meteor.call('productionLines.endProduction', 
            linesArr,
            function(error, result) {
              if (error) {
                Bert.alert(error.reason, 'danger')
              } else {
                Bert.alert("Successfully Updated Production Lines!", 'success')

                let text = []
                for (let i = 0; i < result.length; i++){
                  text.push(
                    <tr key={i+7}>
         
                      <td>
                          {result[i].name}
                      </td>
                      <td>
                        {result[i].lotNumber}
                      </td>
                      
                  </tr>
                  )
                }
                
                this.setState({
                  text: text
                })
              }
            }.bind(this))


}
  render() {

    let user = Meteor.user()
    let changeStatus = null
    let updateButton = null
    if (Roles.userIsInRole(user, ['admin', 'manager'])) {
      changeStatus = <th><b>Change Status</b></th>
      updateButton = <div><hr className='divider'></hr><p></p>
      <Timer />
      <p></p>


      <Button type="submit" bsStyle="success" onClick={this.updateStatus.bind(this)} >
          Update
      </Button></div>
    }

      return (
        <div>
          <p></p>
          <table>
            <tbody>
            <tr>
              <th>
                  <b>Production Line</b>
              </th>
              <th>
                  <b>Status</b>
              </th>

              <th>
                  <b>Formula In Production</b>
              </th>

              <th>
                  <b>Quantity</b>
              </th>

              {changeStatus}
              

            </tr>
              {this.renderLinesInfo()}
              </tbody>
          </table>

          <p></p>
          
          {updateButton}
          <p></p>
          <p><b>Update Results: </b></p>
          <p></p>


          <table width="500">
            <tbody>
            <tr >
              <th>
                  <b>Product</b>
              </th>
              <th>
                  <b>Lot Number</b>
              </th>
            </tr>
            {this.state.text}
              </tbody>
          </table>
          
                    
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





