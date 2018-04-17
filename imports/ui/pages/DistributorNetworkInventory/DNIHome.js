import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DNINavBar from '../../components/DNINavBar/DNINavBar.js'

class DNIHome extends Component {
  constructor(props) {
    super(props);  
}

  render() {
    return (
      <div className="container">
        <header>
            <h1>Distributed Network Inventory</h1>
        </header>
        
        <DNINavBar hist = {this.props}/>

      </div>
    );
  }
}

export default DNIHome;





