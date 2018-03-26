import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import FormulaManagementNavBar from '../../components/FormulaManagementNavBar/FormulaManagementNavBar.js'
import  Formulas  from '../../../api/Formulas/formulas.js'
import { Intermediates } from '../../../api/Intermediates/intermediates.js'
import IngredientList from '../../../api/Ingredients/IngredientList.js'
import FormulaListItem from '../../components/Formula/FormulaListItem.js'
import IntermediateListItem from '../../components/IntermediateListItem/IntermediateListItem.js'
import { Row, Col, FormGroup, ControlLabel, Button , ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';


class FormulaManagement extends Component {
  constructor(props) {
    super(props);   
    this.state = {
      radioState: true
    };
}

renderFinalProducts() {
  return (
    <div>

      <h2>List of Final Products</h2>
      <hr className='divider'></hr>

      <ul>
        {this.renderFinalProductsList()}
      </ul>

    </div>
  );
}

renderFinalProductsList() {
  return this.props.formulas.map((formula) => (
    <div key = {formula._id} className="containerNone">
    <FormulaListItem key={formula._id} formula={formula} />
    </div>
  ));
}

renderIntermediates() {
  return (
    <div>

      <h2>List of Intermediates</h2>
      <hr className='divider'></hr>

      <ul>
        {this.renderIntermediatesList()}
      </ul>

    </div>
  );
}

renderIntermediatesList() {
  return this.props.intermediates.map((intermediate) => (
    <div key = {intermediate._id} className="containerNone">
    <IntermediateListItem key={intermediate._id} intermediate={intermediate} />
    </div>
  ));
}


onChangeRadio(){
 
  this.setState((prevState) => ({
      radioState: !prevState.radioState
  }))
}


  render() {
    return (
      <div>

      <p></p>
      <ButtonToolbar>
          <ToggleButtonGroup type="radio" name="options" ref={radio => (this.radio) = radio} defaultValue={1} onChange={this.onChangeRadio.bind(this)}>
              <ToggleButton value={1}>Final Products</ToggleButton>
              <ToggleButton value={2}>Intermediates</ToggleButton>
          </ToggleButtonGroup>
      </ButtonToolbar>
      <p></p>

      {this.state.radioState ? this.renderFinalProducts() : this.renderIntermediates()}

      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('formulas');
  Meteor.subscribe('ingredients')
  Meteor.subscribe('intermediates')
    return {
      formulas: Formulas.find({}).fetch(),
      ingredients: IngredientList.find({}).fetch(),
      intermediates: Intermediates.find({}).fetch()
    };
  })(FormulaManagement);





