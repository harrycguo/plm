import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, Button , ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import BulkImportFinalProduct from './BulkImportFinalProduct'
import BulkImportIntermediates from './BulkImportIntermediates'

class BulkImportFormulasHome extends Component {
  constructor(props) {
    super(props);  
    this.state = {
        radioState: true
      };
    
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

      {this.state.radioState ? <BulkImportFinalProduct /> : <BulkImportIntermediates />}

      </div>
    );
  }
}

export default BulkImportFormulasHome;





