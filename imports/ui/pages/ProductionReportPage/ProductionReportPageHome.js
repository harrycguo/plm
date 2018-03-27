import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, ControlLabel, Button , ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap'
import ProductionReportPage from './ProductionReportPage.js'
import ProductionHistoryPage from './ProductionHistoryPage.js'


class ProductionReportPageHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
        radioState: true
      }
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
                <ToggleButton value={1}>Production Report</ToggleButton>
                <ToggleButton value={2}>Production History</ToggleButton>
            </ToggleButtonGroup>
        </ButtonToolbar>
        <p></p>

        {this.state.radioState ? <ProductionReportPage /> : <ProductionHistoryPage />}

        </div>
    );
  }
}

export default ProductionReportPageHome;





