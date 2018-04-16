import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, Button , ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import validate from '../../../modules/validate.js';
import FormulaIngredientInput from '../../components/FormulaIngredientInput/FormulaIngredientInput.js'
import ProductionLineInput from './ProductionLineInput.js'

class AddProductionLine extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            inputs: [],
            formulaList: [],
        };

        this.add = this.add.bind(this);
}

    componentDidMount() {

    const component = this;

        validate(component.form, {
            rules: {
                plName: {
                    required: true,
                },
                plDescription: {
                    required: false,
                },

            },
            messages: {
                plName: {
                    required: 'Specify Production Line Name',
                },
        
            },
            submitHandler() { 
                component.handleSubmit(); },
        });
    }

    add() {
        const inputs = this.state.inputs;
        this.setState((prevState) => ({
            inputs: prevState.inputs.concat(
                <div className="containerSome" key={inputs.length}><ProductionLineInput
                    key={inputs.length}
                    index={inputs.length}
                    ref={input => (this[`input${inputs.length}`] = input)}
                    onChange={this.onChangeInput.bind(this)}
                /></div>),
            formulaList: prevState.formulaList.concat({ formula: {
                formula: null,
                valid: true,
            } })
        }))
    }

    onChangeInput(index, componentToBeUpdated, valid) {
        
        let inputs = this.state.inputs
        let formulaList = this.state.formulaList
 
        formulaList[index].formula = {
            formula: componentToBeUpdated,
            valid: true
        }

        if (!valid) {
            inputs[index] = <div className="containerEmpty" key={index}></div>
            formulaList[index].formula = {
                formula: null,
                valid: false,
            }
        }

        this.setState({
            inputs: inputs,
            formulaList: formulaList,
        })
    }


    handleSubmit(){

        let name = this.plName.value
        let description = this.plDescription.value
        let formulaList = this.state.formulaList

        let formulaListArray = new Array()

        for (let i = 0; i < formulaList.length; i++){
            
            if (formulaList[i].formula.valid) {
                if (formulaList[i].formula.formula != null) {
                    formulaListArray.push({
                        id: formulaList[i].formula.formula.state.formula,
                    })
                } else {
                    formulaListArray.push({
                        id: null,
                        
                    })
                }
            }
        }
   
        Meteor.call('productionLines.insert',
            name,
            description,
            formulaListArray,
            function(error, result) {
                if (error){
                    Bert.alert(error.reason, 'danger');
                } else {
                    Bert.alert('Added New Production Line!', 'success');
                    document.getElementById("form").reset();
                    this.setState({
                        inputs: [],
                        formulaList: []
                    })
                    
                }
            }.bind(this))
    }

  render() {

      return (
        <div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()} id='form'>

          <FormGroup>
              <ControlLabel>Production Line Name</ControlLabel>
              <input
                  type="text"
                  name="plName"
                  placeholder="Enter Production Line Name"
                  ref={plName => (this.plName = plName)}
                  className="form-control"
              />
          </FormGroup>

          <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <textarea
                  type="text"
                  rows="3"
                  name="plDescription"
                  ref={plDescription => (this.plDescription = plDescription)}
                  className="form-control"
                  placeholder="Description of Production Line"
              />
          </FormGroup>

          <ControlLabel>Formulas To Produce:</ControlLabel>

          <p></p>

          {this.state.inputs.map(function (input, index) {
              return input;
          })}

          <Button
              bsStyle="info"
              bsSize="small"
              onClick={this.add}>
              Add Intermediate / Final Product
          </Button>

          <p></p>
        <hr className='divider'></hr>
         <p></p>

          <Button type="submit" bsStyle="success">Submit</Button>
          </form>
        </div>
      )
  }
}

export default AddProductionLine





